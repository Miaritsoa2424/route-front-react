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

  return (
    <div className="manager-container">
      <header className="manager-header">
        <div className="header-content">
          <h1>Liste des entreprises</h1>
          <button className="logout-button" onClick={() => navigate('/manager')}>Retour</button>
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
    </div>
  );
}
