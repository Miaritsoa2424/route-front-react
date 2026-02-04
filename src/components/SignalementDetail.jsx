import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Maximize, 
  DollarSign, 
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  X,
  ZoomIn
} from 'lucide-react';
import '../styles/SignalementDetail.css';

export default function SignalementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [signalement, setSignalement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    loadSignalementDetails();
  }, [id]);

  const loadSignalementDetails = async () => {
    setLoading(true);
    try {
      // TODO: Remplacer par un appel API réel
      // const data = await signalementService.getSignalementById(id);
      
      // Données statiques pour l'instant
      const mockData = {
        id: id,
        type: 'Signalement routier',
        lat: -18.9100,
        lng: 47.5225,
        date: '2025-01-15',
        status: 'en cours',
        surface: 150,
        budget: 5500000,
        entreprise: 'Entreprise BTP Madagascar',
        description: 'Route fortement dégradée nécessitant une réfection urgente. Plusieurs nids-de-poule importants compromettent la circulation des véhicules.',
        photos: [
          {
            id: 1,
            url: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=1200',
            thumbnail: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400',
            description: 'Vue d\'ensemble de la zone affectée',
            date: '2025-01-15'
          },
          {
            id: 2,
            url: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1200',
            thumbnail: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400',
            description: 'Détail des fissures sur la chaussée',
            date: '2025-01-15'
          },
          {
            id: 3,
            url: 'https://images.unsplash.com/photo-1584267380142-a3de57be0d48?w=1200',
            thumbnail: 'https://images.unsplash.com/photo-1584267380142-a3de57be0d48?w=400',
            description: 'Nid-de-poule principal',
            date: '2025-01-15'
          },
          {
            id: 4,
            url: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200',
            thumbnail: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400',
            description: 'Vue latérale des dégradations',
            date: '2025-01-15'
          },
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=1200',
            thumbnail: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400',
            description: 'Vue d\'ensemble de la zone affectée',
            date: '2025-01-15'
          },
          {
            id: 2,
            url: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1200',
            thumbnail: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400',
            description: 'Détail des fissures sur la chaussée',
            date: '2025-01-15'
          }
        ]
      };
      
      setSignalement(mockData);
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'nouveau': 'Nouveau',
      'en cours': 'En cours',
      'terminé': 'Terminé'
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'nouveau': <AlertCircle size={20} />,
      'en cours': <Clock size={20} />,
      'terminé': <CheckCircle size={20} />
    };
    return icons[status];
  };

  const getStatusClass = (status) => {
    const map = {
      'nouveau': 'nouveau',
      'en cours': 'en-cours',
      'terminé': 'termine'
    };
    return map[status] || status.replace(/\s+/g, '-');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedPhoto(null);
  };

  if (loading) {
    return (
      <div className="signalement-detail-container">
        <div className="loading-state">
          <p>Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!signalement) {
    return (
      <div className="signalement-detail-container">
        <div className="error-state">
          <AlertCircle size={48} />
          <p>Signalement non trouvé</p>
          <button onClick={() => navigate('/')} className="back-button">
            Retour à la carte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signalement-detail-container">
      {/* Header */}
      <header className="detail-header">
        <div className="header-background"></div>
        <div className="header-content">
          <button 
            className="back-button-nav"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} />
            <span>Retour à la carte</span>
          </button>
          <div className="header-title-section">
            <h1 className="detail-title">Détails du signalement #{signalement.id}</h1>
            <span className={`detail-status status-${getStatusClass(signalement.status)}`}>
              {getStatusIcon(signalement.status)}
              {getStatusLabel(signalement.status)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="detail-main-content">
        <div className="detail-grid">
          {/* Left Column - Photos */}
          <div className="photos-section">
            <div className="section-header">
              <ImageIcon size={24} />
              <h2>Photos du signalement</h2>
            </div>
            
            {signalement.photos && signalement.photos.length > 0 ? (
              <div className="photos-grid">
                {signalement.photos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className="photo-card"
                    onClick={() => openLightbox(photo)}
                  >
                    <div className="photo-wrapper">
                      <img 
                        src={photo.thumbnail} 
                        alt={photo.description}
                        className="photo-img"
                      />
                      <div className="photo-overlay">
                        <ZoomIn size={32} />
                        <span>Agrandir</span>
                      </div>
                    </div>
                    <div className="photo-info">
                      <p className="photo-description">{photo.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-photos">
                <ImageIcon size={48} />
                <p>Aucune photo disponible</p>
              </div>
            )}
          </div>

          {/* Right Column - Information */}
          <div className="info-section">
            <div className="section-header">
              <MapPin size={24} />
              <h2>Informations détaillées</h2>
            </div>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">
                  <Calendar size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Date de signalement</span>
                  <span className="info-value">
                    {new Date(signalement.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <MapPin size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Localisation</span>
                  <span className="info-value">
                    {signalement.lat.toFixed(6)}, {signalement.lng.toFixed(6)}
                  </span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <Maximize size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Surface affectée</span>
                  <span className="info-value">{signalement.surface} m²</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <DollarSign size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Budget estimé</span>
                  <span className="info-value">{formatCurrency(signalement.budget)}</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <Building2 size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Entreprise assignée</span>
                  <span className="info-value">{signalement.entreprise}</span>
                </div>
              </div>
            </div>

            {signalement.description && (
              <div className="description-section">
                <h3>Description</h3>
                <p>{signalement.description}</p>
              </div>
            )}

            <div className="action-buttons">
              <button 
                className="btn-secondary"
                onClick={() => window.open(`https://www.google.com/maps?q=${signalement.lat},${signalement.lng}`, '_blank')}
              >
                <MapPin size={18} />
                Voir sur Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && selectedPhoto && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <X size={24} />
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedPhoto.url} 
              alt={selectedPhoto.description}
              className="lightbox-img"
            />
            <div className="lightbox-info">
              <p className="lightbox-description">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
