import { useState, useEffect } from 'react';
import { signalementService } from '../services/api';

export default function SignalementList() {
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSignalement, setNewSignalement] = useState({
    surface: '',
    budget: '',
    localisation: '',
  });

  useEffect(() => {
    fetchSignalements();
  }, []);

  const fetchSignalements = async () => {
    try {
      setLoading(true);
      const data = await signalementService.getAllSignalements();
      setSignalements(data);
    } catch (err) {
      setError('Erreur lors du chargement des signalements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSignalement = async (e) => {
    e.preventDefault();
    try {
      await signalementService.createSignalement(newSignalement);
      setNewSignalement({ surface: '', budget: '', localisation: '' });
      fetchSignalements();
    } catch (err) {
      setError('Erreur lors de la création du signalement');
      console.error(err);
    }
  };

  const handleDeleteSignalement = async (id) => {
    try {
      await signalementService.deleteSignalement(id);
      fetchSignalements();
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestion des Signalements</h2>

      <form onSubmit={handleAddSignalement} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Ajouter un signalement</h3>
        <input
          type="number"
          placeholder="Surface (m²)"
          value={newSignalement.surface}
          onChange={(e) => setNewSignalement({ ...newSignalement, surface: e.target.value })}
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="number"
          placeholder="Budget"
          value={newSignalement.budget}
          onChange={(e) => setNewSignalement({ ...newSignalement, budget: e.target.value })}
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Localisation"
          value={newSignalement.localisation}
          onChange={(e) => setNewSignalement({ ...newSignalement, localisation: e.target.value })}
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 10px' }}>Ajouter</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Surface</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Budget</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Localisation</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {signalements.map((signalement) => (
            <tr key={signalement.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{signalement.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{signalement.surface}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{signalement.budget}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{signalement.localisation}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button
                  onClick={() => handleDeleteSignalement(signalement.id)}
                  style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
