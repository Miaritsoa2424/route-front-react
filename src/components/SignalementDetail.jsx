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
  ZoomIn,
  ExternalLink,
  Info,
  Navigation
} from 'lucide-react';
import '../styles/SignalementDetail.css';
import { signalementService, imageService } from '../services/api';

export default function SignalementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [signalement, setSignalement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadSignalementDetails();
  }, [id]);

  const loadSignalementDetails = async () => {
    setLoading(true);
    try {
      const data = await signalementService.getSignalementById(id);
      const imagesData = await imageService.getImagesBySignalement(id);
      
      const formattedImages = imagesData.map(img => ({
        id: img.id,
        url: img.lien,
        thumbnail: img.lien,
        description: img.description || 'Aucune description',
        date: img.date
      }));
      
      setImages(formattedImages);
      setSignalement(data);
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
          <div className="loading-spinner"></div>
          <p>Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!signalement) {
    return (
      <div className="signalement-detail-container">
        <div className="error-state">
          <AlertCircle size={64} />
          <h2>Signalement introuvable</h2>
          <p>Le signalement que vous recherchez n'existe pas ou a été supprimé.</p>
          <button onClick={() => navigate('/')} className="back-button-error">
            <ArrowLeft size={18} />
            Retour à la carte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signalement-detail-container">
      {/* Header moderne */}
      <header className="detail-header">
        <div className="header-background">
          <div className="header-gradient"></div>
        </div>
        <div className="header-content">
          <button 
            className="back-button-nav"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>
          
          <div className="header-info">
            <span className="detail-title">Détails du signalement #{signalement.idSignalement}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="detail-main-content">
        <div className="detail-grid">
          {/* Galerie Photos */}
          <div className="photos-section">
            <div className="section-header">
              <div className="section-header-icon">
                <ImageIcon size={22} />
              </div>
              <div>
                <h2 className="section-title">Galerie photos</h2>
                <p className="section-subtitle">{images.length} photo{images.length > 1 ? 's' : ''} disponible{images.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            
            {images && images.length > 0 ? (
              <div className="photos-grid">
                {images.map((photo, index) => (
                  <div 
                    key={photo.id} 
                    className="photo-card"
                    onClick={() => openLightbox(photo)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="photo-wrapper">
                      <img 
                        src={photo.thumbnail} 
                        alt={photo.description}
                        className="photo-img"
                      />
                      <div className="photo-overlay">
                        <div className="photo-overlay-content">
                          <ZoomIn size={32} />
                          <span>Agrandir</span>
                        </div>
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
                <div className="no-photos-icon">
                  <ImageIcon size={64} />
                </div>
                <h3>Aucune photo disponible</h3>
                <p>Aucune photo n'a été ajoutée pour ce signalement.</p>
              </div>
            )}
          </div>

          {/* Informations détaillées */}
          <div className="info-section">
            <div className="section-header">
              <div className="section-header-icon">
                <Info size={22} />
              </div>
              <div>
                <h2 className="section-title">Informations</h2>
                <p className="section-subtitle">Détails techniques et localisation</p>
              </div>
            </div>
            
            <div className="info-content">
              <div className="info-card">
                <div className="info-card-icon">
                  <MapPin size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-label">Coordonnées GPS</span>
                  <p className="info-value">{signalement.latitude}, {signalement.longitude}</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Maximize size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-label">Surface affectée</span>
                  <p className="info-value">{signalement.surface} m²</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <DollarSign size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-label">Budget estimé</span>
                  <p className="info-value">{formatCurrency(signalement.budget)}</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Building2 size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-label">Entreprise responsable</span>
                  <p className="info-value">{signalement.entreprise?.nom || 'Non assignée'}</p>
                </div>
              </div>

              {signalement.description && (
                <div className="description-card">
                  <div className="description-header">
                    <AlertCircle size={20} />
                    <h3>Description du problème</h3>
                  </div>
                  <p className="description-text">{signalement.description}</p>
                </div>
              )}

              <div className="action-section">
                <button 
                  className="maps-button"
                  onClick={() => window.open(`https://www.google.com/maps?q=${signalement.latitude},${signalement.longitude}`, '_blank')}
                >
                  <ExternalLink size={20} />
                  <span>Ouvrir dans Google Maps</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox améliorée */}
      {lightboxOpen && selectedPhoto && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <X size={24} />
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-container">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.description}
                className="lightbox-img"
              />
            </div>
            <div className="lightbox-info">
              <div className="lightbox-info-icon">
                <ImageIcon size={20} />
              </div>
              <p className="lightbox-description">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}