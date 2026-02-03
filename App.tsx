
import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Database, 
  Cpu, 
  Github, 
  Linkedin, 
  Mail, 
  FileDown, 
  Menu, 
  X,
  ChevronRight,
  Target,
  Zap,
  TrendingUp,
  Stethoscope,
  ShoppingCart,
  Store,
  Pizza,
  Code2,
  PieChart,
  Settings2,
  ExternalLink,
  Filter,
  BrainCircuit,
  Layers,
  Container,
  Activity,
  Building2,
  Briefcase,
  MapPin
} from 'lucide-react';

// --- Types ---

interface Project {
  title: string;
  category: string;
  desc: string;
  longDesc: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  icon: React.ReactNode;
  accentColor: string;
  accentHex: string;
  iconBg: string;
  link?: string;
  demoUrl?: string; // local HTML / video / iframe URL to show demo
  demoType?: 'iframe' | 'video' | 'image';
}

interface Tool {
  name: string;
  logoUrl: string;
  color: string;
}

// helper to build slug from project title
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Projects list (used across portfolio and demo route)
const PROJECTS: Project[] = [
  {
    title: "Healthcare Analytics",
    category: "SANTÉ",
    desc: "Analyse des listes d'attente hospitalières avec segmentation démographique et comparaison annuelle des performances.",
    longDesc: "Ce projet Power BI analyse plus de 24 millions de cas hospitaliers pour identifier les goulots d'étranglement dans les listes d'attente. \n\nL'implémentation inclut des calculs DAX complexes pour le calcul des durées d'attente moyennes et la segmentation par groupes d'âge. Le dashboard permet aux gestionnaires de santé de visualiser les tendances saisonnières et d'allouer les ressources plus efficacement.",
    tags: ["Power BI", "DAX", "SQL Server", "ETL", "Healthcare Data"],
    accentColor: "text-neon-mint",
    accentHex: "#2dd4bf",
    iconBg: "bg-neon-mint/10",
    icon: <Stethoscope size={24} />,
    metrics: [
      { label: "Cas analysés", value: "24M" },
      { label: "Précision", value: "99.8%" }
    ],
    link: "https://example.com/healthcare-demo",
    demoUrl: "https://res.cloudinary.com/ddxwnpqur/video/upload/v1770143964/healthcare-demo_c18czg.mp4",
    demoType: "video"
  },
  {
    title: "Shopify Sales Funnel",
    category: "E-COMMERCE",
    desc: "Dashboard de suivi des ventes Shopify, analyse du tunnel de conversion (LTV, CAC, Retention) et prévisions.",
    longDesc: "Une solution complète de Business Intelligence pour les boutiques Shopify. \n\nJ'ai automatisé l'extraction des données via l'API Shopify pour alimenter un entrepôt de données SQL. Le dashboard analyse le parcours client depuis la première visite jusqu'à l'achat récurrent. Les KPIs suivis incluent le ROAS, la valeur vie client (LTV) et le coût d'acquisition client (CAC).",
    tags: ["Python", "SQL", "Power BI", "Marketing Analytics"],
    accentColor: "text-purple-400",
    accentHex: "#a855f7",
    iconBg: "bg-purple-400/10",
    icon: <ShoppingCart size={24} />,
    metrics: [
      { label: "Ventes totales", value: "$4.18M" },
      { label: "Rétention", value: "46%" }
    ],
    link: "https://example.com/shopify-demo",
    demoUrl: "https://res.cloudinary.com/ddxwnpqur/video/upload/v1770143971/shopify-demo_on3dgr.mp4",
    demoType: "video"
  },
  {
    title: "Retail Global Ops",
    category: "RETAIL",
    desc: "Analyse géographique de la performance retail mondiale avec indicateurs de chaîne logistique en temps réel.",
    longDesc: "Visualisation de la performance d'un réseau mondial de 306 points de vente. \n\nLe projet intègre des données de stock en temps réel et des prévisions de demande basées sur l'historique des ventes régionales. L'utilisation de cartes interactives permet d'identifier les zones de sous-performance géographique instantanément.",
    tags: ["Power BI", "Geo-mapping", "Azure Data Factory", "SQL", "Supply Chain"],
    accentColor: "text-blue-400",
    accentHex: "#60a5fa",
    iconBg: "bg-blue-400/10",
    icon: <Store size={24} />,
    metrics: [
      { label: "Boutiques", value: "306" },
      { label: "Latence", value: "< 2s" }
    ],
    link: "https://example.com/retail-demo",
    demoUrl: "https://res.cloudinary.com/ddxwnpqur/video/upload/v1770143970/retail-demo_b64vws.mp4",
    demoType: "video"
  },
  {
    title: "Pizza Sales Report",
    category: "F&B",
    desc: "Identification des pics d'activité et performance produits pour une chaîne de restauration rapide.",
    longDesc: "Optimisation opérationnelle via l'analyse des ventes horaires et journalières. \n\nL'analyse a révélé des modèles de consommation spécifiques permettant d'ajuster le staffing en cuisine et de réduire le gaspillage alimentaire de 15%. J'ai utilisé Python pour le nettoyage des données massives issues des systèmes POS.",
    tags: ["Python (Pandas)", "Matplotlib", "Power BI", "pizza sales dataset"],
    accentColor: "text-orange-400",
    accentHex: "#fb923c",
    iconBg: "bg-orange-400/10",
    icon: <Pizza size={24} />,
    metrics: [
      { label: "Revenue", value: "$817K" },
      { label: "ROI", value: "240%" }
    ],
    link: "https://example.com/pizza-demo",
    demoUrl: "https://res.cloudinary.com/ddxwnpqur/video/upload/v1770143968/pizza-demo_gbjthy.mp4",
    demoType: "video"
  },
  {
    title: "Meta Ads Campaign Analytics",
    category: "DIGITAL MARKETING",
    desc: "Analyse des performances publicitaires Meta (Facebook/Instagram) avec attribution multi-touch et optimisation budgétaire.",
    longDesc: "Tableau de bord complet pour mesurer et optimiser les campagnes Meta Ads : ingestion depuis l'API Marketing (Facebook/Instagram), matching cross-device, attribution multi-touch, optimisation automatique des budgets par canal et tests A/B. \n\nPipeline ETL avec Airflow, stockage S3 / BigQuery, transformations avec dbt, modèles de prédiction pour scoring de conversion (LightGBM / Optuna) et rapports interactifs (Power BI / Tableau). Analyse d'attribution, lift tests, et automatisation des règles d'enchères.",
    tags: [
      "Facebook Marketing dataset",
      "dax",
      "power query",
      "Instagram Ads dataset",
      "Python (Pandas)",
      "SQL",
      "BigQuery",
      "dbt",
      "Airflow",
      "Power BI"
    ],
    accentColor: "text-pink-500",
    accentHex: "#ec4899",
    iconBg: "bg-pink-500/10",
    icon: <Target size={24} />,
    metrics: [
      { label: "CTR moyen", value: "11.76%" },
      { label: "ROAS", value: "4.6x" }
    ],
    link: "",
    demoUrl: "https://res.cloudinary.com/ddxwnpqur/video/upload/v1770143966/META-ADS_FINAL-demo_b6bwzt.mp4",
    demoType: "video"
  },
  {
    title: "People Analytics — RH",
    category: "Ressources Humaines",
    desc: "Dashboard RH pour analyser engagement, turnover et prédire le risque d'attrition des collaborateurs.",
    longDesc: "Solution People Analytics couvrant l'ingestion des données HRIS, enquêtes d'engagement, requisition & performance. Pré-traitement des données, features engineering (tenure, trajectoire de carrière, scores d'engagement), modèles de prédiction d'attrition (LightGBM) avec explications SHAP, clustering pour segmentation des talents et NLP pour l'analyse de sentiment des feedbacks. Livrables : API de scoring (FastAPI), tableaux interactifs (Power BI) et playbooks RH pour actions préventives.",
    tags: [
      "HR dataset",
      "Dax",
      "power query",
      "Python",
      "Pandas",
      "Power BI",
      "SQL",
      "Azure",
      "Airflow",
      "Excel",
      "Survival Analysis"
    ],
    accentColor: "text-emerald-400",
    accentHex: "#34d399",
    iconBg: "bg-emerald-400/10",
    icon: <Building2 size={24} />,
    metrics: [
      { label: "Taux d'attrition", value: "32.59%" },
      { label: "Score d'engagement", value: "73/100" }
    ],
    link: "",
    demoUrl: "https://res.cloudinary.com/ddxwnpqur/video/upload/v1770143971/RH-demo_sy7aeu.mp4",
    demoType: "video"
  },
  {
    title: "Spotify Listening Insights",
    category: "DATA SCIENCE",
    desc: "Pipeline et dashboard d'analyse des habitudes d'écoute Spotify : segmentation, recommandations et visualisations interactives.",
    longDesc: "Architecture de bout en bout : collecte via l'API Spotify, stream processing (Kafka), ETL vers PostgreSQL / Redshift, transformation et enrichissement, et modèles de recommandation (collaborative filtering, matrix factorization). Dashboard d'exploration des comportements par segment, analyses temporelles et A/B pour tests de features. Déploiement de microservices de recommandation avec Docker et endpoints REST pour intégration front.",
    tags: [
      "Spotify dataset",
      "dax",
      "power query",
      "excel",
      "SQL",
      "Spark",
      "PostgreSQL",
      "Python",
      "TensorFlow",
      "Streamlit",
      "Power BI"
    ],
    accentColor: "text-green-400",
    accentHex: "#10b981",
    iconBg: "bg-green-400/10",
    icon: <BarChart3 size={24} />,
    metrics: [
      { label: "Utilisateurs analysés", value: "120K" },
      { label: "Modèle RMSE", value: "0.87" }
    ],
    link: "",
    demoUrl: "https://res.cloudinary.com/ddxwnpqur/video/upload/v1770143964/spotify-demo_awgcso.mp4",
    demoType: "video"
  }
];

// Fonction de téléchargement CV
const downloadCV = () => {
  const link = document.createElement('a');
  link.href = '/cv-data-analyst-business-intelligence-ryann-loic.pdf';
  link.download = 'cv-data-analyst-business-intelligence-ryann-loic.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- Sub-components ---

const DataStreamBackground = () => {
  const streams = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.03 + Math.random() * 0.07,
      width: Math.random() * 1.5 + 1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 data-stream-bg" />
      {streams.map((stream) => (
        <motion.div
          key={stream.id}
          initial={{ y: '-100%' }}
          animate={{ y: '1000%' }}
          transition={{
            duration: stream.duration,
            repeat: Infinity,
            delay: stream.delay,
            ease: "linear"
          }}
          className="absolute top-0 bg-gradient-to-b from-transparent via-neon-mint/20 to-transparent"
          style={{
            left: stream.left,
            width: `${stream.width}px`,
            height: '25vh',
            opacity: stream.opacity,
          }}
        />
      ))}
    </div>
  );
};

const TypewriterTitle = () => {
  const titles = [
    "Analyste Business Intelligence",
    "Avec Power BI",
    "Consultant Transformation Digitale",
    "Spécialiste Industrie 4.0"
  ];
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const TYPING_SPEED = 100;
  const DELETING_SPEED = 50;
  const PAUSE_TIME = 2000;

  useEffect(() => {
    const currentTitle = titles[index];
    
    let timer: number;

    if (!isDeleting && displayText === currentTitle) {
      timer = window.setTimeout(() => setIsDeleting(true), PAUSE_TIME);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % titles.length);
    } else {
      const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
      timer = window.setTimeout(() => {
        setDisplayText(currentTitle.substring(0, isDeleting ? displayText.length - 1 : displayText.length + 1));
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint to-electric-blue glow-text-mint inline-block min-h-[1.2em]">
      {displayText}<span className="animate-pulse text-white font-normal ml-1">|</span>
    </span>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-industry-dark/95 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-mint to-electric-blue rounded-lg flex items-center justify-center font-tech font-extrabold text-industry-dark shadow-lg">
            RL
          </div>
          <span className="font-tech text-sm font-bold tracking-tight text-white">Data Analyst with RYANN LOIC</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Accueil', 'À propos', 'Portfolio', 'Compétences', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-[12px] font-tech font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
              {item}
            </a>
          ))}
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 bg-industry-dark z-50 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button className="absolute top-6 right-6" onClick={() => setIsOpen(false)}><X size={32} /></button>
            {['Accueil', 'À propos', 'Portfolio', 'Compétences', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={() => setIsOpen(false)} className="text-2xl font-tech font-bold text-white hover:text-neon-mint">
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeading = ({ subtitle, title, centered = false }: { subtitle: string, title: string, centered?: boolean }) => (
  <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
    <span className="text-neon-mint font-tech text-xs font-bold tracking-[0.3em] uppercase block mb-3">{subtitle}</span>
    <h2 className="text-3xl md:text-5xl font-tech font-extrabold text-white leading-tight">{title}</h2>
  </div>
);

const DynamicShowcase = ({ images = ['/logos/power%20bi.jpg', '/logos/excel.svg', '/logos/SQLServerManagementStudiologo-1.png'] }: { images?: string[] }) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setIdx((i) => (i + 1) % images.length), 3800);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="w-full flex items-center justify-center">
      <motion.div
        initial={{ y: 0, x: 0, scale: 0.98 }}
        animate={{ y: [0, -12, 0], x: [0, 8, 0], scale: [0.98, 1, 0.98] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-[520px] h-[420px] rounded-3xl overflow-hidden border border-white/6 bg-gradient-to-br from-black/60 to-transparent shadow-2xl"
      >
        {images.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt={`showcase-${i}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: i === idx ? 1 : 0, scale: i === idx ? 1 : 0.96 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0 w-full h-full object-contain p-8 bg-transparent"
            onError={(e) => {
              const cur = e.currentTarget;
              if (cur.src.includes('power') || cur.src.toLowerCase().includes('power')) {
                // prefer the uploaded JPG (contains a space in filename)
                cur.src = '/logos/power%20bi.jpg';
              }
              else if (cur.src.includes('Excel') || cur.src.toLowerCase().includes('excel')) cur.src = '/logos/excel.svg';
              else if (cur.src.toLowerCase().includes('sql')) cur.src = '/logos/SQLServerManagementStudiologo-1.png';
            }}
            style={{ pointerEvents: 'none' }}
          />
        ))}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`w-2.5 h-2.5 rounded-full ${i === idx ? 'bg-neon-mint' : 'bg-white/20'}`} aria-label={`go-to-${i}`} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const Hero = () => (
  <section id="accueil" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
    <div className="container mx-auto px-6 z-10 grid lg:grid-cols-12 gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:col-span-7"
      >
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-neon-mint/10 border border-neon-mint/20 text-neon-mint text-[11px] font-bold mb-8 uppercase tracking-widest">
          <Zap size={14} className="animate-pulse" />
          Disponible pour de nouvelles opportunités
        </div>
        
        <h1 className="text-4xl lg:text-7xl font-tech font-extrabold text-white mb-6 leading-[1.1]">
          <motion.span 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            Transformer la donnée en valeur
          </motion.span>
          <br />
          <TypewriterTitle />
        </h1>
        
        <p className="text-[17px] text-slate-400 mb-10 max-w-2xl leading-relaxed">
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            Expert en <span className="text-white font-semibold">Valorisation de la donnée</span>, automatisation de workflows (n8n, Make) et Intelligence Artificielle appliquée à l'industrie. Je combine vision métier, automatisation et rigueur algorithmique pour propulser vos décisions stratégiques.
          </motion.span>
        </p>

        <div className="flex flex-wrap gap-4 mb-12">
          <a href="#portfolio" className="px-8 py-4 bg-neon-mint text-industry-dark font-bold rounded-lg hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all flex items-center gap-2 text-[14px] uppercase tracking-wider">
            Voir mes projets <ChevronRight size={18} />
          </a>
          <button onClick={downloadCV} className="px-8 py-4 border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 transition-all flex items-center gap-2 text-[14px] uppercase tracking-wider">
            <FileDown size={18} /> Télécharger mon CV
          </button>
        </div>

        <div className="flex items-center gap-6 text-slate-500">
          <a href="https://www.linkedin.com/in/ryann-loic-bondeh-essomba-108ab6388/" className="hover:text-neon-mint transition-colors" target="_blank" rel="noopener noreferrer"><Linkedin size={24} /></a>
          <a href="https://github.com/justryann" className="hover:text-neon-mint transition-colors" target="_blank" rel="noopener noreferrer"><Github size={24} /></a>
          <a href="mailto:bondehessomba@icloud.com" className="hover:text-neon-mint transition-colors" onClick={(e) => { e.preventDefault(); window.location.href = 'mailto:bondehessomba@icloud.com'; }}>
            <Mail size={24} />
          </a>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="lg:col-span-5 hidden lg:block relative"
      >
        <div className="relative group flex justify-center items-center h-[600px]">
          <div className="absolute -inset-4 bg-gradient-to-r from-neon-mint to-electric-blue opacity-10 blur-3xl group-hover:opacity-20 transition-opacity"></div>
          <div className="relative z-10 w-[400px] h-[400px] rounded-full overflow-hidden border-8 border-white/5 shadow-2xl glow-border">
            <img 
              src="/profile.png" 
              alt="Ryann Loic BONDEH ESSOMBA" 
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0"
              style={{ objectPosition: 'center 25%' }}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop";
              }}
            />
          </div>
          
          {/* Floating badges */}
          <motion.div 
            animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 bg-industry-dark/95 border border-neon-mint/30 p-4 rounded-2xl backdrop-blur-md shadow-2xl z-20 whitespace-nowrap"
          >
            <Code2 className="text-neon-mint mb-1 inline-block mr-2" size={20} />
            <span className="text-[10px] font-tech font-bold text-white uppercase tracking-tighter">Power BI Expert</span>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-20 -left-8 bg-gradient-to-r from-electric-blue/20 to-purple-500/20 border border-electric-blue/30 p-4 rounded-2xl backdrop-blur-md shadow-2xl z-20"
          >
            <Zap className="text-electric-blue mb-1 inline-block mr-2" size={20} />
            <span className="text-[10px] font-tech font-bold text-white uppercase tracking-tighter">Industrie 4.0</span>
          </motion.div>

          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-4 right-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 p-4 rounded-2xl backdrop-blur-md shadow-2xl z-20"
          >
            <Database className="text-purple-400 mb-1 inline-block mr-2" size={20} />
            <span className="text-[10px] font-tech font-bold text-white uppercase tracking-tighter">Data Driven</span>
          </motion.div>

          
        </div>
      </motion.div>
    </div>
  </section>
);

const About = () => {
  return (
    <section id="à-propos" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
            <SectionHeading subtitle="À PROPOS" title="Du Management à l'Intelligence Artificielle" />

            <div className="space-y-6 text-slate-400 leading-relaxed text-[17px] max-w-xl">
              <p>
                Je suis <span className="text-white font-bold">Ryann Loic BONDEH ESSOMBA</span>, Data Analyst spécialisé en Industrie 4.0. J'aide les entreprises industrielles à transformer leurs flux de données en décisions opérationnelles et stratégiques.
              </p>

              <p>
                Mon approche combine compréhension métier, architecture de données robuste et modélisation avancée (statistiques, machine learning). J'interviens sur :
              </p>

              <ul className="list-disc pl-6 space-y-2 text-slate-400">
                <li><strong>Stratégie & gouvernance data</strong> — audit, définition de KPIs, cartographie sources.</li>
                <li><strong>Ingestion & pipelines</strong> — automation ETL/ELT, qualité et fiabilisation des données.</li>
                <li><strong>Analytics & visualisation</strong> — dashboards Power BI, storytelling, monitoring opérationnel.</li>
                <li><strong>Modélisation</strong> — prévision, détection d'anomalies, scoring.</li>
              </ul>

              <p>
                Résultats typiques : réduction du temps de reporting (-60%), centralisation de sources (&gt;15), et amélioration de la détection d'anomalies financières. Je livre des dashboards actionnables et des pipelines reproductibles.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <div className="p-6 bg-[#0a1120] border border-white/5 rounded-2xl">
                  <h4 className="text-white font-tech text-xs font-bold uppercase tracking-tight mb-2">Méthodologie</h4>
                  <p className="text-[12px] text-slate-400">Discovery → Ingest → Model → Deploy — approche itérative et orientée résultats.</p>
                </div>
                <div className="p-6 bg-[#0a1120] border border-white/5 rounded-2xl">
                  <h4 className="text-white font-tech text-xs font-bold uppercase tracking-tight mb-2">Livrables</h4>
                  <p className="text-[12px] text-slate-400">Dashboards BI, pipelines ETL, notebooks reproductibles, documentation & playbooks.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} className="hidden lg:flex justify-center">
            <DynamicShowcase images={["/logos/power%20bi.jpg", "/logos/excel.svg", "/logos/SQLServerManagementStudiologo-1.png"]} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CaseStudy = () => {
  const metrics = [
    { icon: <Activity className="w-8 h-8" />, value: "-60%", label: "Temps de reporting", desc: "De 4h à 1h30", color: "from-neon-mint to-cyan-400" },
    { icon: <BarChart3 className="w-8 h-8" />, value: "12", label: "Anomalies détectées", desc: "Financières", color: "from-electric-blue to-blue-400" },
    { icon: <Database className="w-8 h-8" />, value: "15+", label: "Sources de données", desc: "Centralisées", color: "from-purple-500 to-pink-500" }
  ];

  return (
    <section id="case-study" className="py-32 relative z-10 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-neon-mint/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [100, 0, 100],
            y: [50, 0, 50]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-l from-electric-blue/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="text-xs font-tech font-bold text-neon-mint uppercase tracking-widest inline-block px-4 py-2 bg-white/5 border border-neon-mint/30 rounded-full mb-6"
            >
              ✨ Étude de Cas Détaillée
            </motion.span>
            <h2 className="text-5xl lg:text-6xl font-tech font-black text-white mt-6 mb-6">
              <span className="block">Stage Data Analyst :</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-mint via-electric-blue to-purple-500 glow-text-mint">ARMP Cameroun</span>
            </h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 max-w-2xl mx-auto mt-4"
            >
              Digitalisation d'une agence gouvernementale camerounaise avec impact mesurable
            </motion.p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {[
              { title: "Organisation", content: "Agence de Régulation des Marchés Publics", icon: Building2 },
              { title: "Secteur", content: "Organisation Gouvernementale", icon: Briefcase },
              { title: "Localisation", content: "Yaoundé, Cameroun", icon: MapPin }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neon-mint/10 to-electric-blue/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
                <div className="relative p-6 bg-[#0a1120]/50 backdrop-blur-sm border border-white/10 group-hover:border-neon-mint/50 rounded-2xl transition-all duration-500">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="p-3 bg-gradient-to-br from-neon-mint/20 to-electric-blue/20 rounded-xl group-hover:from-neon-mint/40 group-hover:to-electric-blue/40 transition-all">
                      <item.icon className="text-neon-mint w-5 h-5" />
                    </div>
                    <h4 className="text-white font-tech text-sm font-bold uppercase tracking-tight">{item.title}</h4>
                  </div>
                  <p className="text-slate-300 font-tech text-sm ml-14">{item.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="group relative mb-12"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-mint/20 via-electric-blue/20 to-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700" />
            <div className="relative p-10 bg-gradient-to-br from-[#0a1120] via-[#0f1629] to-[#0a1120] border border-white/10 group-hover:border-neon-mint/30 rounded-3xl transition-all duration-500 overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-conic from-neon-mint via-transparent to-electric-blue"
                />
              </div>

              <div className="relative flex items-start gap-6">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-4 bg-gradient-to-br from-neon-mint/30 to-electric-blue/20 rounded-2xl shrink-0 glow-border"
                >
                  <Activity className="text-neon-mint w-7 h-7" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-tech font-bold text-white mb-4 flex items-center gap-2">
                    🎯 Mission
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    Digitalisation complète du suivi des marchés publics. Conception et implémentation d'un <span className="text-neon-mint font-bold">système centralisé d'analyse de données</span> permettant une visibilité en temps réel sur l'ensemble des processus de passation des marchés.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Impact Metrics */}
          <div className="mb-6">
            <motion.h3 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-2xl font-tech font-bold text-white mb-8 text-center"
            >
              🚀 Impact Mesurable
            </motion.h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {metrics.map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="group relative h-full"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${metric.color} opacity-0 group-hover:opacity-20 blur-2xl rounded-2xl transition-all duration-700`} />
                  <div className="relative h-full p-8 bg-[#0a1120]/60 backdrop-blur-sm border border-white/10 group-hover:border-white/30 rounded-2xl transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden">
                    {/* Animated background */}
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className={`absolute inset-0 bg-gradient-to-r ${metric.color} opacity-5`}
                    />
                    
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className={`relative z-10 p-4 rounded-2xl bg-gradient-to-br ${metric.color} bg-opacity-10 mb-6`}
                    >
                      <div className="text-white opacity-80">{metric.icon}</div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: i * 0.2 + 0.3, type: "spring", stiffness: 100 }}
                      className={`text-5xl font-tech font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r ${metric.color}`}
                    >
                      {metric.value}
                    </motion.div>
                    
                    <h4 className="text-white font-tech font-bold uppercase tracking-tight text-sm mb-1 relative z-10">
                      {metric.label}
                    </h4>
                    <p className="text-xs text-slate-400 font-tech relative z-10">{metric.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mt-16"
          >
            {/* CTA removed as requested */}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const AcademicPath = () => {
  const schools = [
    { 
      name: "Univ. de Soa Yaoundé", 
      location: "Cameroun", 
      logo: "🏛️" 
    },
    { 
      name: "Keyce Informatique & IA", 
      location: "Cameroun", 
      logoUrl: "/keyce_informatique_cameroun_logo.jpg" 
    },
    { 
      name: "ESTIAM Paris", 
      location: "France", 
      logoUrl: "/estiam_logo_fond_violet-scaled.jpg" 
    }
  ];

  const cardVariants = {
    initial: { y: 0, scale: 1 },
    hover: { 
      y: -15, 
      scale: 1.03,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  };

  const logoVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.15, 
      rotate: [0, -5, 5, 0], 
      transition: { 
        rotate: { duration: 0.6, ease: "easeInOut", repeat: 0 },
        scale: { type: 'spring', stiffness: 400, damping: 12 } 
      } 
    }
  };

  return (
    <section className="py-24 bg-white/[0.01]">
      <div className="container mx-auto px-6 text-center">
        <SectionHeading subtitle="ÉDUCATION" title="Mon parcours académique" centered />
        <div className="flex flex-wrap justify-center gap-10">
          {schools.map((school, i) => (
            <motion.div 
              key={i} 
              initial="initial"
              whileHover="hover"
              variants={cardVariants}
              className="bg-white p-8 rounded-[40px] w-64 aspect-square flex flex-col items-center justify-center shadow-2xl relative overflow-hidden cursor-default"
            >
              <motion.div 
                variants={logoVariants}
                className="h-28 w-28 flex items-center justify-center mb-6"
              >
                {school.logoUrl ? (
                  <img src={school.logoUrl} alt={school.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-6xl">{school.logo}</span>
                )}
              </motion.div>
              <h4 className="text-industry-dark font-tech font-extrabold text-[13px] uppercase leading-tight px-4">{school.name}</h4>
              <p className="text-slate-400 text-[9px] font-tech font-bold uppercase tracking-widest mt-3">{school.location}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PortfolioCard: React.FC<{ 
  project: Project;
  onViewDetails: (project: Project) => void;
  onViewDemo?: (project: Project) => void;
}> = ({ project, onViewDetails, onViewDemo }) => {
  const cardVariants = {
    initial: { opacity: 0, scale: 0.9, y: 0, borderColor: 'rgba(255, 255, 255, 0.05)' },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9 },
    hover: { 
      y: -12,
      borderColor: project.accentHex,
      boxShadow: `0 20px 40px -20px rgba(2, 6, 23, 0.7), 0 0 25px ${project.accentHex}33`
    }
  };

  const titleVariants = {
    hover: { 
      scale: 1.12, 
      color: '#ffffff',
      textShadow: `0 0 20px ${project.accentHex}cc, 0 0 10px ${project.accentHex}`,
      x: 6
    }
  };

  return (
    <motion.div 
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      className="bg-[#0a1120] border border-white/5 rounded-2xl p-8 relative group transition-all h-full flex flex-col"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${project.iconBg} ${project.accentColor} group-hover:scale-110 transition-transform`}>
          {project.icon}
        </div>
        <div>
          <span className="text-[10px] font-tech font-bold text-slate-500 uppercase tracking-widest">{project.category}</span>
          <motion.h3 
            variants={titleVariants}
            className="text-xl font-tech font-extrabold tracking-tight cursor-default origin-left"
          >
            {project.title}
          </motion.h3>
        </div>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed mb-8 flex-grow group-hover:text-slate-200 transition-colors">
        {project.desc}
      </p>

      <div className="flex gap-4 mb-8">
        {project.metrics.map((metric, i) => (
          <div key={i} className="flex-1 bg-[#151f33] border border-white/5 rounded-xl p-3 group-hover:border-white/10 transition-colors">
            <span className="text-[9px] font-tech font-bold text-slate-500 uppercase block mb-1">{metric.label}</span>
            <span className={`text-[13px] font-tech font-extrabold ${project.accentColor}`}>{metric.value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => onViewDetails(project)}
          className="flex-1 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-tech font-bold text-[11px] uppercase tracking-widest hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all flex items-center justify-center gap-2"
        >
          Détails <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {onViewDemo && project.demoUrl ? (
          <button
            onClick={() => onViewDemo(project)}
            className="flex-1 py-3 bg-neon-mint text-industry-dark font-tech font-bold text-[11px] uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all flex items-center justify-center gap-2"
          >
            Voir Démo <ExternalLink size={14} />
          </button>
        ) : project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-neon-mint text-industry-dark font-tech font-bold text-[11px] uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all flex items-center justify-center gap-2"
          >
            Voir Démo <ExternalLink size={14} />
          </a>
        ) : null}
      </div>
    </motion.div>
  );
};

const ProjectModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-12"
  >
    <div className="absolute inset-0 bg-industry-dark/80 backdrop-blur-md" onClick={onClose}></div>
    <motion.div 
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 20, opacity: 0 }}
      className="bg-[#0a1120] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden relative shadow-2xl z-10"
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-20">
        <X size={24} />
      </button>

      <div className="p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${project.iconBg} ${project.accentColor}`}>
            {project.icon}
          </div>
          <div>
            <span className="text-[11px] font-tech font-bold text-slate-500 uppercase tracking-[0.2em] mb-1 block">{project.category}</span>
            <h3 className="text-3xl font-tech font-extrabold text-white">{project.title}</h3>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h4 className="text-white font-tech text-xs font-bold uppercase tracking-widest mb-4">Description Approfondie</h4>
            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
              {project.longDesc}
            </p>
          </div>

          <div>
            <h4 className="text-white font-tech text-xs font-bold uppercase tracking-widest mb-4">Technologies utilisées</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-300 text-[10px] font-tech font-bold uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-white/5">
            <div className="flex gap-6">
              {project.metrics.map((metric, i) => (
                <div key={i}>
                  <span className="text-[9px] font-tech font-bold text-slate-500 uppercase block mb-1">{metric.label}</span>
                  <span className={`text-[15px] font-tech font-extrabold ${project.accentColor}`}>{metric.value}</span>
                </div>
              ))}
            </div>
            
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`px-6 py-3 ${project.iconBg} ${project.accentColor} rounded-xl font-tech font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform`}
              >
                Démonstration <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const DemoViewer: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const triedRef = React.useRef<Record<string, boolean>>({});

  const makeAlternates = (url?: string) => {
    if (!url) return [] as string[];
    const encoded = url.replace(/ /g, '%20');
    const dashed = url.replace(/%20/g, '-');
    const alt1 = encoded === url ? dashed : encoded;
    const alt2 = dashed === url ? encoded : dashed;
    return Array.from(new Set([url, alt1, alt2]));
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    const src = vid.currentSrc || vid.src || project.demoUrl || '';
    if (!src) return;

    if (!triedRef.current[src]) {
      triedRef.current[src] = true;
      const alts = makeAlternates(project.demoUrl);
      // find next alternate that's different from current
      const next = alts.find(a => a !== src && !triedRef.current[a]);
      if (next) {
        triedRef.current[next] = true;
        vid.src = next;
        vid.load();
        vid.play().catch(() => {});
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-8"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="relative w-full max-w-6xl h-[80vh] bg-[#071022] rounded-3xl overflow-hidden border border-white/10 z-10 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 text-slate-300 hover:text-white">
          <X size={28} />
        </button>
        <div className="h-full w-full">
          {project.demoType === 'video' ? (
            <video
              ref={videoRef}
              src={project.demoUrl}
              controls
              onError={handleVideoError}
              className="w-full h-full object-cover"
            />
          ) : (
            <iframe src={project.demoUrl} title={`${project.title} demo`} className="w-full h-full" frameBorder="0" />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("TOUS");

  const projects: Project[] = PROJECTS;

  const categories = ["TOUS", ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = activeFilter === "TOUS" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <SectionHeading subtitle="PORTFOLIO" title="Mes Réalisations Phares" centered />
        
        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
          <div className="flex items-center gap-2 text-slate-500 mr-4 hidden sm:flex">
            <Filter size={16} />
            <span className="text-[11px] font-tech font-bold uppercase tracking-widest">Filtrer par :</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2.5 rounded-xl font-tech font-bold text-[10px] uppercase tracking-widest transition-all ${
                activeFilter === cat 
                ? 'bg-neon-mint text-industry-dark shadow-[0_0_15px_rgba(45,212,191,0.3)]' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div 
          layout
          className="grid md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project, i) => (
              <PortfolioCard 
                key={project.title} 
                project={project} 
                onViewDetails={setSelectedProject}
                onViewDemo={setSelectedDemo}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
        {selectedDemo && (
          <DemoViewer project={selectedDemo} onClose={() => setSelectedDemo(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

const TechSection = () => {
  const skillGroups = [
    {
      title: "Analyse & Modélisation",
      icon: <BrainCircuit size={28} />,
      tools: [
        { name: "Python", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", color: "#3776ab" },
        { name: "Scikit-learn", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg", color: "#f7931e" },
        { name: "Jupyter", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/38/Jupyter_logo.svg", color: "#f37726" }
      ],
      skills: ["Analyse descriptive & prédictive", "Séries temporelles", "Probabilités & Tests A/B"]
    },
    {
      title: "Outils BI & Visualisation",
      icon: <PieChart size={28} />,
      tools: [
        { name: "Power BI", logoUrl: "/logos/power%20bi.jpg", color: "#f2c811" },
        { name: "Excel", logoUrl: "/logos/excel.svg", color: "#217346" }
      ],
      skills: ["Power BI (DAX / Power Query)", "Dashboards Interactifs", "Storytelling de données"]
    },
    {
      title: "Infrastructures & SQL",
      icon: <Database size={28} />,
      tools: [
        { name: "SQL Server Management Studio", logoUrl: "/logos/SQLServerManagementStudiologo-1.png", color: "#a91d22" },
        { name: "MySQL", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", color: "#00758f" },
        { name: "Snowflake", logoUrl: "https://www.vectorlogo.zone/logos/snowflake/snowflake-icon.svg", color: "#21b9ff" }
      ],
      skills: ["SQL (T-SQL, PL/SQL)", "Optimisation de requêtes", "Data Warehousing"]
    },
    {
      title: "Big Data & Industrie",
      icon: <Activity size={28} />,
      tools: [
        { name: "Spark", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg", color: "#e25a1c" },
        { name: "Azure", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg", color: "#0078d4" },
        { name: "Airflow", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/AirflowLogo.png", color: "#017cee" }
      ],
      skills: ["Elasticsearch / ELK", "IoT Stream Processing", "Maintenance Prédictive"]
    },
    {
      title: "Automatisation & Productivité",
      icon: <Zap size={28} />,
      tools: [
        { name: "n8n", logoUrl: "/logos/n8n Icon-901x567.png", color: "#FF6A00" },
        { name: "Make", logoUrl: "/logos/fbads_make.jpg", color: "#FF3366" },
        { name: "JIRA", logoUrl: "/logos/jira-logo-png_seeklogo-468163.png", color: "#0052CC" },
        { name: "Notion", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg", color: "#000000" }
      ],
      skills: ["Automatisation de workflows (n8n, Make)", "Orchestration d'APIs", "Gestion de projet & documentation (JIRA, Notion)"]
    }
  ];

  return (
    <section id="compétences" className="py-24 relative z-10 overflow-hidden">
      {/* Floating animated background elements */}
      <motion.div 
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-neon-mint/20 to-transparent rounded-full blur-3xl opacity-30"
      />
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-l from-electric-blue/20 to-transparent rounded-full blur-3xl opacity-30"
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading subtitle="EXPERTISE" title="Écosystème Technique" centered />
        
        <div className="grid lg:grid-cols-2 gap-8">
          {skillGroups.map((group, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] overflow-hidden group"
            >
              <div className="bg-[#0a1120] p-10 rounded-[1.9rem] h-full flex flex-col">
                <div className="flex items-center gap-5 mb-10">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-16 h-16 bg-neon-mint/10 rounded-2xl flex items-center justify-center text-neon-mint shadow-[0_0_20px_rgba(45,212,191,0.1)] group-hover:shadow-[0_0_30px_rgba(45,212,191,0.2)] transition-all"
                  >
                    {group.icon}
                  </motion.div>
                  <h4 className="text-2xl font-tech font-extrabold text-white">{group.title}</h4>
                </div>

                <div className="flex flex-wrap gap-8 mb-10">
                  {group.tools.map((tool, ti) => (
                    <motion.div 
                      key={ti} 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3 + ti * 0.5, repeat: Infinity }}
                      whileHover={{ scale: 1.1 }}
                      className="flex flex-col items-center gap-3 group/tool"
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-2xl p-3 flex items-center justify-center border border-white/5 group-hover/tool:border-white/20 transition-all backdrop-blur-sm relative">
                        <div className="absolute inset-0 bg-white/5 rounded-2xl blur-sm scale-90 group-hover/tool:scale-110 transition-transform" style={{ backgroundColor: tool.color + '22' }} />
                        <img 
                          src={tool.logoUrl} 
                          alt={tool.name} 
                          className="w-full h-full object-contain relative z-10 brightness-90 group-hover/tool:brightness-110 group-hover/tool:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all" 
                          onError={(e) => {
                            e.currentTarget.src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matcha/matcha-original.svg";
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-tech font-bold text-slate-500 uppercase tracking-widest group-hover/tool:text-white transition-colors">{tool.name}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
                  {group.skills.map((skill, si) => (
                    <div key={si} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-mint shadow-[0_0_5px_rgba(45,212,191,1)]" />
                      <span className="text-slate-400 text-xs font-semibold leading-tight">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="py-24 bg-industry-dark relative overflow-hidden z-10">
    <div className="absolute inset-0 bg-gradient-to-t from-neon-mint/5 to-transparent"></div>
    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block p-4 rounded-full bg-neon-mint/10 mb-8">
           <Mail className="text-neon-mint" size={40} />
        </div>
        <SectionHeading subtitle="CONTACT" title="Échangeons sur vos projets" centered />
        <p className="text-slate-400 mb-12 max-w-xl mx-auto text-[17px] leading-relaxed">
          Disponible pour des opportunités de stage de fin d'études ou d'alternance en Data Analytics & Business Intelligence.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          <a href="mailto:bondehessomba@icloud.com" className="px-10 py-5 bg-neon-mint text-industry-dark font-extrabold rounded-lg hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all flex items-center gap-3 text-[14px] uppercase tracking-widest" onClick={(e) => { e.preventDefault(); window.location.href = 'mailto:bondehessomba@icloud.com'; }}>
            ME CONTACTER
          </a>
          <button onClick={downloadCV} className="px-10 py-5 border border-white/10 text-white font-extrabold rounded-lg hover:bg-white/5 transition-all flex items-center gap-3 text-[14px] uppercase tracking-widest">
            <FileDown size={20} /> TÉLÉCHARGER CV
          </button>
        </div>

        <div className="flex justify-center gap-12 pt-12 border-t border-white/5">
           <a href="https://www.linkedin.com/in/ryann-loic-bondeh-essomba-108ab6388/" className="flex flex-col items-center gap-3 group" target="_blank" rel="noopener noreferrer">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-neon-mint group-hover:border-neon-mint transition-all">
                <Linkedin size={22} />
              </div>
              <span className="text-[10px] font-tech font-bold text-slate-500 uppercase tracking-widest">LinkedIn</span>
           </a>
           <a href="https://github.com/justryann" className="flex flex-col items-center gap-3 group" target="_blank" rel="noopener noreferrer">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-neon-mint group-hover:border-neon-mint transition-all">
                <Github size={22} />
              </div>
              <span className="text-[10px] font-tech font-bold text-slate-500 uppercase tracking-widest">GitHub</span>
           </a>
        </div>
        
          <div className="mt-8 text-center space-y-2">
           <div className="text-slate-300">Email: <a href="mailto:bondehessomba@icloud.com" className="text-neon-mint">bondehessomba@icloud.com</a></div>
           <div className="text-slate-300">Contact: <a href="tel:+33605777132" className="text-neon-mint">+33 6 05 77 71 32</a></div>
          </div>

          <div className="mt-20 text-slate-700 text-[10px] font-tech font-bold uppercase tracking-[0.4em]">
            © 2026 Ryann Loic BONDEH ESSOMBA - Expert Data Analytics
          </div>
      </div>
    </div>
  </section>
);

const MainAppUI: React.FC = () => {
  return (
    <div className="min-h-screen bg-industry-dark text-white selection:bg-neon-mint selection:text-industry-dark font-sans">
      <DataStreamBackground />
      <Navbar />
      <Hero />
      <About />
      <CaseStudy />
      <AcademicPath />
      <Portfolio />
      <TechSection />
      <Contact />
      
      <motion.button 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-neon-mint text-industry-dark flex items-center justify-center z-50 hover:scale-110 transition-transform shadow-[0_0_20px_rgba(45,212,191,0.5)]"
      >
        <TrendingUp size={28} className="-rotate-45" />
      </motion.button>
    </div>
  );
};

const DemoRoute: React.FC = () => {
  const { slug } = useParams();
  if (!slug) return <Navigate to="/" />;
  const project = PROJECTS.find((p) => slugify(p.title) === slug);
  if (!project) return <Navigate to="/" />;
  return (
    <div className="min-h-screen bg-black/80">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-neon-mint font-bold">← Retour</Link>
          <h2 className="text-white font-extrabold">{project.title} — Démo</h2>
          <div />
        </div>
      </div>
      <DemoViewer project={project} onClose={() => { window.history.back(); }} />
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/demo/:slug" element={<DemoRoute />} />
      <Route path="/*" element={<MainAppUI />} />
    </Routes>
  </BrowserRouter>
);

export default App;
