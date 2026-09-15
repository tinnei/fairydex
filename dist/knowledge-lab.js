(() => {
  const $ = id => document.getElementById(id);
  const label = value => ({ many: 'More than 6', corolla_lobe: 'Corolla lobe (fused petal tip)', ray_floret: 'Ray floret (one ray on a head)',
    deep_notch: 'Deep notch toward leaf centre', peltate_complete: 'Complete blade; stalk attaches underneath',
    vegetative: 'Vegetative / leaf-only', yellow_stamens: 'Yellow or orange anthers', single_flower: 'One flower (not a head)',
    flower_cluster: 'Cluster of distinct flowers' }[value] || value.replaceAll('_', ' '));
  const controls = {}, sources = {};
  let lastResult, photoURL, photoInfo = null;
  for (const [title, groups] of [['Flower / stage', ['stage', 'flower']], ['Leaf', ['leaf']], ['Plant / fruit', ['context', 'fruit']]]) {
    const fieldset = document.createElement('fieldset'), legend = document.createElement('legend'), fields = document.createElement('div');
    legend.textContent = title; fields.className = 'fields'; fieldset.append(legend, fields);
    for (const [key, definition] of Object.entries(BOTANICAL_KNOWLEDGE.fields)) {
      if (!groups.includes(definition.group)) continue;
      const wrapper = document.createElement('label'), select = document.createElement('select');
      select.id = `feature-${key}`; select.name = key;
      select.add(new Option('Unknown / not visible', ''));
      definition.values.forEach(value => select.add(new Option(label(value), value)));
      wrapper.append(document.createTextNode(definition.label), select); fields.append(wrapper); controls[key] = select;
      select.addEventListener('change', () => { sources[key] = 'manual'; $('example').value = ''; run(); });
    }
    $('observationForm').append(fieldset);
  }
  $('observationForm').addEventListener('submit', event => event.preventDefault());
  function observations() {
    return Object.fromEntries(Object.entries(controls).filter(([, control]) => control.value).map(([key, control]) =>
      [key, { value: control.value, source: sources[key] || 'manual', reliability: 1 }]));
  }
  function run() {
    lastResult = KnowledgeRanker.rank(observations(), BOTANICAL_KNOWLEDGE);
    $('status').textContent = label(lastResult.status).toUpperCase();
    $('resultNote').textContent = 'Experimental agreement (−1 to +1), not confidence. Select a candidate to inspect its reference. ' + lastResult.ignored.join(' ');
    $('results').replaceChildren();
    for (const row of lastResult.candidates) {
      const tr = document.createElement('tr');
      const values = [row.rank, row.name, row.possibleStages.map(label).join(' / '),
        ...['flower', 'leaf', 'context', 'fruit'].map(group => row.parts[group] ? row.parts[group].score.toFixed(2) : '—'), row.score.toFixed(2)];
      values.forEach((value, index) => {
        const td = document.createElement('td');
        if (index === 1) {
          const link = document.createElement('a'); link.href = `#reference`; link.textContent = value;
          link.addEventListener('click', () => { $('referenceSelect').value = row.id; showReference(); });
          const small = document.createElement('small'); small.textContent = row.referenceTaxon;
          const details = document.createElement('details'), summary = document.createElement('summary'); summary.textContent = 'Matches / conflicts'; details.append(summary);
          const list = document.createElement('div'); list.className = 'evidence';
          for (const item of row.evidence) {
            const p = document.createElement('p'); p.className = item.state;
            p.textContent = `${item.state.toUpperCase()} · ${BOTANICAL_KNOWLEDGE.fields[item.feature].label}: ${label(item.observed)} (${item.source}); reference: ${item.expected?.map(label).join(' / ') || 'not recorded'}`;
            list.append(p);
          }
          details.append(list); td.append(link, small, details);
        } else td.textContent = value;
        tr.append(td);
      });
      $('results').append(tr);
    }
    $('raw').textContent = JSON.stringify({ photo: photoInfo, ...lastResult }, null, 2);
  }
  function clearEvidence() {
    Object.entries(controls).forEach(([key, control]) => { control.value = ''; delete sources[key]; });
    $('example').value = '';
  }
  for (const example of KNOWLEDGE_CASES) $('example').add(new Option(example.label, example.id));
  $('example').addEventListener('change', () => {
    const example = KNOWLEDGE_CASES.find(item => item.id === $('example').value);
    clearEvidence();
    if (example) {
      if (photoURL) URL.revokeObjectURL(photoURL);
      photoURL = null; photoInfo = null; $('photo').value = '';
      $('referencePhoto').hidden = true;
      $('photoStatus').textContent = 'Synthetic evidence example — not extracted from a photo.';
      for (const [key, value] of Object.entries(example.values)) { controls[key].value = value; sources[key] = 'fixture'; }
      $('example').value = example.id;
    }
    run();
  });
  $('clear').addEventListener('click', () => { clearEvidence(); run(); });
  $('photo').addEventListener('change', async () => {
    const file = $('photo').files[0]; if (!file) return;
    clearEvidence();
    if (photoURL) URL.revokeObjectURL(photoURL);
    photoInfo = null;
    $('referencePhoto').hidden = true;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      $('photoStatus').textContent = 'Choose a JPEG, PNG or WebP smaller than 10 MB.'; run(); return;
    }
    photoURL = URL.createObjectURL(file);
    $('referencePhoto').onload = () => { $('referencePhoto').hidden = false; $('photoStatus').textContent = 'Photo stays in this browser. Inspect it and enter visible features below; no anatomy is extracted automatically.'; };
    $('referencePhoto').onerror = () => { $('photoStatus').textContent = 'This image could not be opened. Try another file.'; photoInfo = null; run(); };
    $('referencePhoto').src = photoURL;
    photoInfo = { filename: file.name, size: file.size, role: 'manual_reference_only' };
    run();
  });
  $('download').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([$('raw').textContent], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'flower-feature-test.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  for (const plant of BOTANICAL_KNOWLEDGE.plants) $('referenceSelect').add(new Option(plant.name, plant.id));
  function showReference() {
    const plant = BOTANICAL_KNOWLEDGE.plants.find(p => p.id === $('referenceSelect').value);
    const root = $('referenceDetails'); root.replaceChildren();
    for (const text of [plant.referenceTaxon, plant.scopeNote, plant.notes, 'Source-backed draft · not expert reviewed. Stage coverage: ' + plant.stages.map(s => label(s.stage)).join(', ')]) {
      const p = document.createElement('p'); p.textContent = text; root.append(p);
    }
    const grid = document.createElement('div'); grid.className = 'reference-grid';
    for (const group of ['flower', 'leaf', 'context', 'fruit']) {
      const box = document.createElement('div'), heading = document.createElement('h3'); heading.textContent = group.toUpperCase(); box.append(heading);
      for (const [key, definition] of Object.entries(BOTANICAL_KNOWLEDGE.fields)) {
        if (definition.group !== group) continue;
        const trait = plant.traits[key];
        const staged = plant.stages.filter(s => s.traits[key]).map(s => `${label(s.stage)}: ${s.traits[key].values.map(label).join(' / ')}`);
        const p = document.createElement('p'); p.textContent = `${definition.label}: ${trait ? trait.values.map(label).join(' / ') : staged.join('; ') || 'not recorded'}`; box.append(p);
      }
      grid.append(box);
    }
    root.append(grid);
    const links = document.createElement('p'); links.className = 'ref-sources';
    plant.sources.forEach(source => { const a = document.createElement('a'); a.href = source.url; a.textContent = `${source.publisher} (${source.id})`; links.append(a); });
    root.append(links);
  }
  $('referenceSelect').addEventListener('change', showReference);
  const reference = new URLSearchParams(location.search).get('reference');
  if (BOTANICAL_KNOWLEDGE.plants.some(p => p.id === reference)) $('referenceSelect').value = reference;
  showReference(); run();
})();
