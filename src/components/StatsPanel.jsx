import '../styles/StatsPanel.css';

export default function StatsPanel({ stats, problems }) {
  const statusCounts = {
    nouveau: problems.filter(p => p.status === 'nouveau').length,
    enCours: problems.filter(p => p.status === 'en cours').length,
    terminé: problems.filter(p => p.status === 'terminé').length
  };

  return (
    <div className="stats-panel">
      <h2>📊 Tableau de Récapitulation</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <h3>{stats.totalPoints}</h3>
            <p>Points signalés</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📐</div>
          <div className="stat-content">
            <h3>{stats.totalSurface.toLocaleString('fr-FR')} m²</h3>
            <p>Surface totale</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{stats.totalBudget.toLocaleString('fr-FR')} €</h3>
            <p>Budget total</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{stats.avancement}%</h3>
            <p>Avancement</p>
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${stats.avancement}%` }}
        ></div>
      </div>

      <div className="status-breakdown">
        <h3>Répartition par statut</h3>
        <div className="status-list">
          <div className="status-item">
            <span className="status-dot nouveau"></span>
            <span className="status-label">Nouveau</span>
            <span className="status-count">{statusCounts.nouveau}</span>
          </div>
          <div className="status-item">
            <span className="status-dot en-cours"></span>
            <span className="status-label">En cours</span>
            <span className="status-count">{statusCounts.enCours}</span>
          </div>
          <div className="status-item">
            <span className="status-dot terminé"></span>
            <span className="status-label">Terminé</span>
            <span className="status-count">{statusCounts.terminé}</span>
          </div>
        </div>
      </div>

      <div className="detailed-table">
        <h3>Détails des signalements</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Surface</th>
              <th>Budget</th>
              <th>Entreprise</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id}>
                <td>#{problem.id}</td>
                <td>{new Date(problem.date).toLocaleDateString('fr-FR')}</td>
                <td>
                  <span className={`status-badge status-${problem.status}`}>
                    {problem.status}
                  </span>
                </td>
                <td>{problem.surface} m²</td>
                <td>{problem.budget.toLocaleString('fr-FR')} €</td>
                <td>{problem.entreprise}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
