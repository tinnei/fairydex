// Semantic observations only. Pixel ratios and silhouette peaks are not anatomy.
const KnowledgeRanker = (() => {
  const provenance = new Set(['manual', 'fixture', 'image_measurement']);
  function normalize(input, knowledge) {
    const result = {}, ignored = [];
    for (const [key, item] of Object.entries(input || {})) {
      if (!item || item.value == null || item.value === '') continue;
      const definition = knowledge.fields[key];
      if (!definition || !definition.values.includes(item.value) || !provenance.has(item.source)) {
        throw new Error(`Invalid observation: ${key}`);
      }
      const reliability = item.reliability === undefined ? 1 : item.reliability;
      if (!Number.isFinite(reliability) || reliability < 0 || reliability > 1) throw new Error(`Invalid reliability: ${key}`);
      if (item.source === 'image_measurement' && key !== 'colour') throw new Error(`Image extraction does not measure ${key}`);
      if (reliability > 0) result[key] = { value: item.value, source: item.source, reliability };
    }
    if (result.count && !result.countUnit) {
      ignored.push('Count ignored: specify whether you counted petals, lobes, tepals, rays or bracts.');
      delete result.count;
    }
    return { observations: result, ignored };
  }
  function stageTraits(plant, stage, knowledge) {
    const traits = { ...plant.traits, ...stage.traits };
    if (stage.stage !== 'flowering') {
      for (const [key, definition] of Object.entries(knowledge.fields)) if (definition.group === 'flower') traits[key] = null;
    }
    return traits;
  }
  function rank(input, knowledge) {
    const { observations, ignored } = normalize(input, knowledge);
    const candidates = [];
    for (const plant of knowledge.plants) {
      const possibleStages = plant.stages.filter(s => !observations.stage || s.stage === observations.stage.value);
      const variants = possibleStages.map(stage => {
        const traits = stageTraits(plant, stage, knowledge), groups = {}, evidence = [];
        for (const [key, observed] of Object.entries(observations)) {
          const definition = knowledge.fields[key];
          // Stage is a selector, and count unit qualifies count; neither adds a vote.
          if (key === 'stage' || !definition.weight) continue;
          const group = definition.group;
          groups[group] ||= { total: 0, net: 0, matched: 0, compared: 0, supplied: 0 };
          const weight = definition.weight * observed.reliability;
          const expected = traits[key];
          let state = !expected ? 'unknown' : expected.values.includes(observed.value) ? 'match' : 'conflict';
          // A count in the wrong unit is not a contradictory numerical count.
          if (key === 'count' && (!traits.countUnit || !traits.countUnit.values.includes(observations.countUnit.value))) state = 'unknown';
          groups[group].total += weight;
          groups[group].supplied++;
          if (state !== 'unknown') groups[group].compared++;
          if (state === 'match') { groups[group].net += weight; groups[group].matched++; }
          if (state === 'conflict') groups[group].net -= weight;
          evidence.push({ feature: key, observed: observed.value, source: observed.source, reliability: observed.reliability,
            expected: expected?.values || null, state, referenceSources: expected?.sources || [] });
        }
        const parts = Object.fromEntries(Object.entries(groups).map(([group, value]) => [group, {
          ...value, score: value.total ? value.net / value.total : 0,
          coverage: value.supplied ? value.compared / value.supplied : 0
        }]));
        const present = Object.values(parts);
        const score = present.length ? present.reduce((sum, p) => sum + p.score, 0) / present.length : 0;
        return { stage: stage.stage, score, parts, evidence, matched: evidence.filter(e => e.state === 'match').length };
      }).sort((a, b) => b.score - a.score);
      if (!variants.length) continue;
      const best = variants[0];
      candidates.push({ id: plant.id, name: plant.name, latin: plant.latin, referenceTaxon: plant.referenceTaxon,
        ...best, possibleStages: variants.filter(v => Math.abs(v.score - best.score) < 1e-9).map(v => v.stage) });
    }
    candidates.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
    let previousScore, position;
    candidates.forEach((candidate, i) => {
      if (previousScore === undefined || Math.abs(previousScore - candidate.score) > 1e-9) position = i + 1;
      candidate.rank = position;
      previousScore = candidate.score;
    });
    const top = candidates[0], lead = candidates.length > 1 ? top.score - candidates[1].score : null;
    const supplied = Object.keys(observations).filter(k => k !== 'stage' && knowledge.fields[k].weight > 0);
    const independentParts = top ? Object.values(top.parts).filter(p => p.matched > 0).length : 0;
    let status = 'insufficient_evidence';
    if (supplied.length >= 3 && independentParts >= 2 && top?.matched >= 3) {
      status = top.score < .4 ? 'no_supported_match' : lead === null ? 'limited_stage_coverage' : lead < .1 ? 'ambiguous' : 'candidate_for_review';
    }
    return { version: '1.0.0', accepted: false, status, lead, observations, ignored, candidates,
      interpretation: 'Signed feature agreement from -1 to 1, not a probability. Unknown reference traits are neutral; each supplied part contributes once. No identification is validated.' };
  }
  return { rank, normalize, stageTraits };
})();
if (typeof module !== 'undefined') module.exports = KnowledgeRanker;
