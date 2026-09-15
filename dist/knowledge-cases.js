// Synthetic inputs test logic, not photo recognition accuracy.
const KNOWLEDGE_CASES = [
  { id: 'waterlily', label: 'Water lily: aquatic + notched leaf', expected: 'waterlily', values: { stage: 'flowering', display: 'single_flower', shape: 'cup', colour: 'pink', habitat: 'water', leafShape: 'round', leafAttachment: 'deep_notch' } },
  { id: 'lotus', label: 'Lotus: complete round leaf', expected: 'lotus', values: { stage: 'flowering', display: 'single_flower', shape: 'cup', colour: 'pink', habitat: 'water', leafShape: 'round', leafAttachment: 'peltate_complete' } },
  { id: 'dandelion-seed', label: 'Dandelion: seed head', expected: 'dandelion', values: { stage: 'mature_seed_head', fruitForm: 'pappus_ball', leafPosition: 'basal', leafMargin: 'lobed' } },
  { id: 'ixora', label: 'Ixora: four lobes per flower', expected: 'ixora', values: { stage: 'flowering', display: 'flower_cluster', shape: 'star', countUnit: 'corolla_lobe', count: '4', leafArrangement: 'opposite', leafMargin: 'entire', leafTexture: 'glossy' } },
  { id: 'pentas', label: 'Pentas: five lobes + hairy leaves', expected: 'pentas', values: { stage: 'flowering', display: 'flower_cluster', shape: 'star', countUnit: 'corolla_lobe', count: '5', leafArrangement: 'opposite', leafTexture: 'hairy' } },
  { id: 'snowdrop', label: 'Snowdrop: six tepals, hanging bell', expected: 'snowdrop', values: { stage: 'flowering', colour: 'white', display: 'single_flower', shape: 'bell', countUnit: 'tepal', count: '6', centre: 'green_inner_marks', orientation: 'hanging', leafPosition: 'basal' } },
  { id: 'rain-lily', label: 'Rain lily: six tepals, upward star', expected: 'rain-lily', values: { stage: 'flowering', colour: 'white', display: 'single_flower', shape: 'star', countUnit: 'tepal', count: '6', orientation: 'upward', leafPosition: 'basal' } },
  { id: 'sunflower', label: 'Sunflower: rays, disc and stem leaves', expected: 'sunflower', values: { stage: 'flowering', display: 'composite_head', colour: 'yellow', centre: 'dark_disc', leafPosition: 'along_stem', leafTexture: 'rough' } },
  { id: 'pink-only', label: 'Pink only: insufficient evidence', expectedStatus: 'insufficient_evidence', values: { colour: 'pink' } }
];
if (typeof module !== 'undefined') module.exports = KNOWLEDGE_CASES;
