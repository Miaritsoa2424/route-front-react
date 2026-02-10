import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { entrepriseService } from '../services/api';
import '../styles/Manager.css';
import '../styles/CompaniesList.css';

export default function CompaniesList() {
  const navigate = useNavigate();
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prixModalOpen, setPrixModalOpen] = useState(false);
  const [selectedEntrepriseId, setSelectedEntrepriseId] = useState('');
  const [prixValue, setPrixValue] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await entrepriseService.getAllEntreprises();
        setEntreprises(data || []);
      } catch (e) {
        console.error('Erreur chargement entreprises', e);
        setError('Impossible de charger la liste des entreprises');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openPrixModal = () => {
    setPrixModalOpen(true);
    setSelectedEntrepriseId('');
    setPrixValue('');
  };

  const closePrixModal = () => {
    setPrixModalOpen(false);
    setSelectedEntrepriseId('');
    setPrixValue('');
  };

  const handleSavePrix = async () => {
    if (!selectedEntrepriseId || !prixValue) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      const prixData = {
        prix: Number(prixValue)
      };
      
      await entrepriseService.createPrix(selectedEntrepriseId, prixData);
      
      // Rafraîchir la liste des entreprises
      const data = await entrepriseService.getAllEntreprises();
      setEntreprises(data || []);
      
      closePrixModal();
      alert('Prix enregistré avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du prix:', error);
      alert('Erreur lors de l\'enregistrement du prix');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-container">
      <header className="manager-header">
        <div className="header-content">
          <h1>Liste des entreprises</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="create-user-button" 
              onClick={openPrixModal}
              style={{ background: '#10b981' }}
            >
              Définir prix par m²
            </button>
            <button className="logout-button" onClick={() => navigate('/manager')}>Retour</button>
          </div>
        </div>
      </header>

      <div className="manager-content">
        {loading ? (
          <div className="loading-state">Chargement...</div>
        ) : error ? (
          <div className="empty-state">{error}</div>
        ) : entreprises.length === 0 ? (
          <div className="empty-state">Aucune entreprise trouvée</div>
        ) : (
          <div className="signalements-list">
            <table className="entreprises-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Dernier prix (Ar/m²)</th>
                </tr>
              </thead>
              <tbody>
                {entreprises.map(ent => (
                  <tr key={ent.idEntreprise}>
                    <td>{ent.nom}</td>
                    <td>{ent.dernierPrix != null ? Number(ent.dernierPrix).toLocaleString('fr-FR') : 'A définir'} Ar</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal pour définir un nouveau prix */}
      {prixModalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(3px)'
          }}
          onClick={closePrixModal}
        >
          <div
            className="modal"
            style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e2e8f0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1a2332' }}>Définir prix par m²</h3>
            <div className="modal-body">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>
                Entreprise
              </label>
              <select
                value={selectedEntrepriseId}
                onChange={(e) => setSelectedEntrepriseId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: '#fff',
                  color: '#000'
                }}
              >
                <option value="">-- Choisir une entreprise --</option>
                {entreprises.map(ent => (
                  <option key={ent.idEntreprise} value={ent.idEntreprise}>
                    {ent.nom}
                  </option>
                ))}
              </select>

              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>
                Prix par m² (Ar)
              </label>
              <input
                type="number"
                value={prixValue}
                onChange={(e) => setPrixValue(e.target.value)}
                placeholder="Entrer le prix"
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '16px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: '#fff',
                  color: '#000'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                className="action-button save"
                onClick={handleSavePrix}
                style={{
                  background: '#10b981',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Enregistrer
              </button>
              <button
                className="action-button cancel"
                onClick={closePrixModal}
                style={{
                  background: '#e5e7eb',
                  color: '#374151',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
