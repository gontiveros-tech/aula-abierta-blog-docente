/**
 * AULA ABIERTA — Mi Blog Docente
 * db.js — Módulo desacoplado de abstracción y persistencia (IndexedDB)
 * 
 * Diseñado con interfaz agnóstica para permitir sustituir fácilmente 
 * el almacenamiento local del navegador por llamadas a una API REST / Supabase.
 */

const DB_NAME = 'AulaAbiertaDB';
const DB_VERSION = 1;

class StorageService {
  constructor() {
    this.db = null;
    this._initPromise = this.init();
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Almacén: Artículos (publicaciones)
        if (!db.objectStoreNames.contains('articles')) {
          const articleStore = db.createObjectStore('articles', { keyPath: 'id' });
          articleStore.createIndex('status', 'status', { unique: false });
          articleStore.createIndex('subject', 'subject', { unique: false });
          articleStore.createIndex('grade', 'grade', { unique: false });
          articleStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Almacén: Comentarios
        if (!db.objectStoreNames.contains('comments')) {
          const commentStore = db.createObjectStore('comments', { keyPath: 'id' });
          commentStore.createIndex('articleId', 'articleId', { unique: false });
          commentStore.createIndex('status', 'status', { unique: false }); // pending, approved, rejected, spam
          commentStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Almacén: Biblioteca Multimedia
        if (!db.objectStoreNames.contains('media')) {
          const mediaStore = db.createObjectStore('media', { keyPath: 'id' });
          mediaStore.createIndex('category', 'category', { unique: false });
          mediaStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Almacén: Configuración y Sesión Demo
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = async (event) => {
        this.db = event.target.result;
        await this._seedInitialData();
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('Error al inicializar IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async _seedInitialData() {
    const articlesCount = await this.count('articles');
    if (articlesCount === 0) {
      // Sembrar datos educativos iniciales
      const defaultArticles = [
        {
          id: 'art-ciclo-agua',
          title: 'El ciclo del agua y su vital importancia para la vida',
          summary: 'Una travesía pedagógica para comprender el viaje inagotable del recurso más preciado de nuestra isla y el planeta.',
          subject: 'Ciencias Naturales',
          grade: '5to Primaria',
          readTime: 5,
          status: 'published', // 'published', 'draft', 'scheduled'
          coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
          coverAlt: 'Esquema y paisaje del ciclo hidrológico en la naturaleza',
          author: 'Lic. Ramona Almonte',
          role: 'Especialista en Didáctica',
          views: 2450,
          createdAt: new Date('2025-03-14T08:30:00Z').getTime(),
          content: `
            <h2>1. ¿De dónde viene la lluvia que riega nuestros campos?</h2>
            <p>Cada vez que observamos un aguacero vespertino sobre Santo Domingo, el verde valle del Cibao o las aguas cristalinas del río Yaque del Norte, estamos presenciando una obra maestra de la naturaleza que lleva miles de millones de años en marcha: <strong>el ciclo del agua</strong>.</p>
            <p>Para los estudiantes de primaria y secundaria en nuestra región insular, comprender este ciclo no es solo una lección de ciencias; es entender la columna vertebral de nuestra agricultura, nuestro clima templado por los alisios y el agua potable que llega a nuestros hogares y aulas escolares.</p>
            
            <blockquote class="pedagogical-quote">
              <p>«El agua que bebió un dinosaurio hace millones de años es exactamente la misma molécula que hoy acaricia las hojas de nuestros manglares dominicanos.»</p>
              <cite>— Principio de Conservación Hidrológica</cite>
            </blockquote>

            <h2>2. Las 4 fases clave del ciclo continuo</h2>
            <p>El agua se transforma de líquido a gas y de gas a sólido en una danza ininterrumpida:</p>
            <ol>
              <li><strong>Evaporación:</strong> El calor del sol calienta el agua superficial de los ríos, lagos y el inmenso mar Caribe, transformándola en vapor invisible que asciende a la atmósfera.</li>
              <li><strong>Condensación:</strong> Al enfriarse en las capas altas, el vapor de agua se agrupa en diminutas gotas formando las nubes y la neblina matutina de nuestras cordilleras.</li>
              <li><strong>Precipitación:</strong> Cuando las nubes se saturan y no sostienen más peso, las gotas caen por gravedad en forma de lluvia, llovizna o, en cumbres muy frías, granizo.</li>
              <li><strong>Recolección:</strong> El agua alimenta los acuíferos subterráneos, fluye por las cuencas de los arroyos y desemboca de vuelta en el océano, reiniciando el milagro.</li>
            </ol>

            <div class="callout callout-info">
              <h4>¿Sabías que...?</h4>
              <p>La Cordillera Central de la República Dominicana es conocida cariñosamente como la <em>«Madre de las Aguas»</em>. Allí nacen los ríos más caudalosos del país garantizando el suministro hídrico vital.</p>
            </div>

            <h2>3. Síntesis y Compromiso Ciudadano</h2>
            <p>El ciclo hidrológico no es estático; se ve directamente impactado por la deforestación de nuestras lomas, la contaminación por plásticos en cañadas y el calentamiento global. Cuidar cada gota y sembrar árboles en nuestras escuelas es proteger la maquinaria misma que hace posible la vida en nuestra isla.</p>
          `,
          tags: ['Biodiversidad', 'MINERD', 'EducaciónAmbiental', 'Agua']
        },
        {
          id: 'art-fracciones-equiv',
          title: 'Comprendiendo las fracciones equivalentes: método visual para el aula y el hogar',
          summary: 'Estrategias gráficas paso a paso para desmitificar las fracciones y construir intuición matemática sólida.',
          subject: 'Matemáticas',
          grade: '6to Primaria',
          readTime: 7,
          status: 'published',
          coverImage: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1200&q=80',
          coverAlt: 'Regletas y círculos fraccionarios manipulativos',
          author: 'Lic. Marcos Peña',
          role: 'Docente de Matemáticas',
          views: 1890,
          createdAt: new Date('2025-03-11T10:15:00Z').getTime(),
          content: `
            <h2>¿Por qué 1/2 es igual a 2/4 y a 4/8?</h2>
            <p>El concepto de equivalencia en fracciones suele ser una de las principales barreras pedagógicas cuando se aborda de forma puramente abstracta. Utilizando el método Singapur (Concreto-Pictórico-Abstracto), los niños pueden ver y tocar las divisiones antes de operar con números.</p>
            <p>Presentar un pastel circular dividido en 2 mitades frente a otro dividido en 4 cuartos permite comprender de inmediato que la cantidad de superficie ocupada es idéntica.</p>
          `,
          tags: ['Matemáticas', 'MétodoCPA', 'GeometríaLúdica']
        },
        {
          id: 'art-oraciones-claras',
          title: 'Cómo construir oraciones claras y coherentes en la escuela primaria',
          summary: 'Guía de sintaxis lúdica para niños: identificación del sujeto y predicado mediante fichas manipulables.',
          subject: 'Lengua Española',
          grade: '4to Primaria',
          readTime: 4,
          status: 'published',
          coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
          coverAlt: 'Cuaderno escolar con ejercicios caligráficos y gramaticales',
          author: 'Mtra. Altagracia Díaz',
          role: 'Docente de Letras',
          views: 940,
          createdAt: new Date('2025-03-08T12:00:00Z').getTime(),
          content: `
            <h2>El juego de los bloques sintácticos</h2>
            <p>Aprender la concordancia entre género y número es mucho más sencillo cuando los alumnos construyen oraciones como si fuesen trenes con vagones: ¿Quién realiza la acción? ¿Qué acción realiza? ¿Dónde o cómo ocurre?</p>
          `,
          tags: ['LenguaEspañola', 'RedacciónInicial', 'Gramática']
        },
        {
          id: 'art-manglares-borrador',
          title: 'Ecosistemas Costeros y Manglares de Samaná',
          summary: 'Una secuencia reflexiva y multidisciplinar diseñada para conectar a los alumnos de primaria con el patrimonio marino.',
          subject: 'Ciencias Naturales',
          grade: '5to Primaria',
          readTime: 6,
          status: 'draft',
          coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
          coverAlt: 'Paisaje de manglar rojo costero',
          author: 'Lic. Ramona Almonte',
          role: 'Especialista en Didáctica',
          views: 0,
          createdAt: new Date('2025-03-15T09:00:00Z').getTime(),
          content: `
            <h2>Guardianes del litoral dominicano</h2>
            <p>Borrador en construcción. Pendiente de anexar la rúbrica formativa y las preguntas de observación de campo.</p>
          `,
          tags: ['Biodiversidad', 'Samaná', 'EducaciónAmbiental']
        }
      ];

      for (const art of defaultArticles) {
        await this.put('articles', art);
      }

      // Sembrar comentarios
      const defaultComments = [
        {
          id: 'comm-1',
          articleId: 'art-ciclo-agua',
          authorName: 'Prof. Manuel Grullón',
          authorType: 'teacher', // teacher, family, student, guest
          authorBadge: 'Docente Verificado',
          schoolInfo: 'Escuela Rep. de Chile • Distrito 10-01',
          content: 'Excelente desglose. Realizamos hoy mismo el experimento de la bolsa con mis 28 alumnos de 5to grado y la emoción fue fantástica. ¿Tiene recomendaciones para adaptarlo con menos luz solar?',
          status: 'pending', // pending, approved, rejected, spam
          createdAt: new Date(Date.now() - 45 * 60 * 1000).getTime(),
          teacherReply: null
        },
        {
          id: 'comm-2',
          articleId: 'art-ciclo-agua',
          authorName: 'Estefanía Peña',
          authorType: 'family',
          authorBadge: 'Familia Comunidad',
          schoolInfo: 'Madre de estudiante de 5to A',
          content: 'Leí este recurso junto a mi hijo para su proyecto escolar de ciencias. Las preguntas finales nos sirvieron para debatir el consumo de agua en casa.',
          status: 'approved',
          createdAt: new Date(Date.now() - 24 * 3600 * 1000).getTime(),
          teacherReply: '¡Qué alegría inmensa, querida Estefanía! Ese asombro espontáneo en los ojos de los chicos es el corazón de la ciencia activa. ¡Un abrazo cálido a su grupo!'
        },
        {
          id: 'comm-3',
          articleId: 'art-fracciones-equiv',
          authorName: 'Visitante_982',
          authorType: 'guest',
          authorBadge: 'Anónimo',
          schoolInfo: 'IP: 179.53.*.* • Sin credenciales',
          content: 'Para resolver rápido sus tareas miren este link gratis en hxxp://descarga-examenes-rd.cc y ganen puntos sin estudiar.',
          status: 'pending', // flagged
          isSpamAlert: true,
          createdAt: new Date(Date.now() - 2 * 3600 * 1000).getTime(),
          teacherReply: null
        }
      ];

      for (const comm of defaultComments) {
        await this.put('comments', comm);
      }

      // Sembrar biblioteca multimedia inicial
      const defaultMedia = [
        {
          id: 'media-esquema-ciclo',
          title: 'Esquema ciclo del agua RD',
          category: 'infografias',
          url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
          sizeKB: 420,
          dimensions: '1200x800',
          altText: 'Diagrama del ciclo del agua en la Cordillera Central y costas dominicanas',
          associatedArticle: 'El ciclo del agua y su importancia para la vida',
          createdAt: new Date('2024-10-14').getTime()
        },
        {
          id: 'media-manglares',
          title: 'Manglares costa norte Samaná',
          category: 'portadas',
          url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
          sizeKB: 310,
          dimensions: '1200x800',
          altText: 'Vista de manglares y estuario tropical',
          associatedArticle: 'Ecosistemas Costeros y Manglares de Samaná',
          createdAt: new Date('2024-10-20').getTime()
        },
        {
          id: 'media-fracciones',
          title: 'Material didáctico fracciones',
          category: 'fichas',
          url: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=1200&q=80',
          sizeKB: 280,
          dimensions: '1080x720',
          altText: 'Caja con regletas de madera fraccionarias',
          associatedArticle: 'Comprendiendo las fracciones equivalentes',
          createdAt: new Date('2024-11-02').getTime()
        }
      ];

      for (const med of defaultMedia) {
        await this.put('media', med);
      }
    }
  }

  // Operaciones CRUD genéricas sobre IndexedDB
  async get(storeName, key) {
    await this._initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async getAll(storeName) {
    await this._initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async put(storeName, item) {
    await this._initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async delete(storeName, key) {
    await this._initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async count(storeName) {
    await this._initPromise;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  // Métodos específicos de Dominio Educativo (Facade)
  async getPublishedArticles() {
    const articles = await this.getAll('articles');
    return articles.filter(a => a.status === 'published').sort((a, b) => b.createdAt - a.createdAt);
  }

  async getArticleById(id) {
    return await this.get('articles', id);
  }

  async saveArticle(articleData) {
    if (!articleData.id) {
      articleData.id = 'art-' + Date.now();
      articleData.createdAt = Date.now();
      articleData.views = 0;
    }
    articleData.updatedAt = Date.now();
    await this.put('articles', articleData);
    return articleData;
  }

  async deleteArticle(id) {
    // También eliminar comentarios asociados
    const comments = await this.getAll('comments');
    for (const c of comments) {
      if (c.articleId === id) {
        await this.delete('comments', c.id);
      }
    }
    return await this.delete('articles', id);
  }

  async getCommentsByArticle(articleId, onlyApproved = true) {
    const all = await this.getAll('comments');
    return all.filter(c => c.articleId === articleId && (!onlyApproved || c.status === 'approved'))
              .sort((a, b) => b.createdAt - a.createdAt);
  }

  async addComment(commentData) {
    if (!commentData.id) {
      commentData.id = 'comm-' + Date.now();
      commentData.createdAt = Date.now();
      commentData.status = 'pending'; // moderación requerida por defecto
    }
    await this.put('comments', commentData);
    return commentData;
  }

  async updateCommentStatus(id, newStatus, replyText = null) {
    const comm = await this.get('comments', id);
    if (!comm) return null;
    comm.status = newStatus;
    if (replyText !== null) {
      comm.teacherReply = replyText;
    }
    await this.put('comments', comm);
    return comm;
  }

  async deleteComment(id) {
    return await this.delete('comments', id);
  }

  async getAllMedia() {
    const items = await this.getAll('media');
    return items.sort((a, b) => b.createdAt - a.createdAt);
  }

  async saveMedia(mediaData) {
    if (!mediaData.id) {
      mediaData.id = 'media-' + Date.now();
      mediaData.createdAt = Date.now();
    }
    await this.put('media', mediaData);
    return mediaData;
  }

  async deleteMedia(id) {
    return await this.delete('media', id);
  }
}

// Instancia global exportable
window.AulaAbiertaDB = new StorageService();
