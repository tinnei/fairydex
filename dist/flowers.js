(() => {
  const flowers = new Map();
  for (const profile of ENGINE_PROFILES) {
    if (!flowers.has(profile.id)) flowers.set(profile.id, { ...profile, stages: new Set() });
    flowers.get(profile.id).stages.add(profile.stage);
  }
  const stageNames = { flowering: 'Flowering', mature_seed_head: 'Mature seed head' };
  const rows = document.getElementById('flowerRows');
  for (const flower of [...flowers.values()].sort((a, b) => a.name.localeCompare(b.name))) {
    const row = document.createElement('tr');
    const values = [flower.name, flower.latin, flower.taxonRank,
      [...flower.stages].map(stage => stageNames[stage] || stage.replaceAll('_', ' ')).join(' · ')];
    for (const value of values) {
      const cell = document.createElement('td');
      cell.textContent = value;
      if (value === flower.name) {
        const link = document.createElement('a');
        link.href = '/knowledge?reference=' + encodeURIComponent(flower.id);
        link.textContent = value;
        cell.replaceChildren(link);
      }
      row.appendChild(cell);
    }
    rows.appendChild(row);
  }
  const expansionRows = document.getElementById('expansionRows');
  for (const flower of FLOWER_EXPANSION) {
    const row = document.createElement('tr');
    for (const value of [flower.name, flower.latin, flower.purpose]) {
      const cell = document.createElement('td');
      cell.textContent = value;
      if (value === flower.name) {
        const link = document.createElement('a');
        link.href = '/knowledge?reference=' + encodeURIComponent(flower.id);
        link.textContent = value;
        cell.replaceChildren(link);
      }
      row.appendChild(cell);
    }
    const cell = document.createElement('td');
    const link = document.createElement('a');
    link.href = flower.commons;
    link.textContent = 'Wikimedia Commons';
    cell.appendChild(link);
    row.appendChild(cell);
    expansionRows.appendChild(row);
  }
  document.getElementById('catalogueCount').textContent = `${flowers.size} candidates · ${ENGINE_PROFILES.length} stage profiles`;
})();
