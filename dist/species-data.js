const PLANT_KNOWLEDGE = {
  waterlily: {
    name: "Water lily",
    latin: "Nymphaea",
    observations: [
      { stage: "flowering", plantPart: "flower", diagnostic: ["broad_layered_petals", "yellow_centre", "floating_round_leaves"], contradictions: ["tiny_compact_florets"] }
    ]
  },
  dandelion: {
    name: "Dandelion",
    latin: "Taraxacum officinale",
    observations: [
      { stage: "flowering", plantPart: "flower", diagnostic: ["yellow_ray_florets", "flat_circular_head", "bare_stalk"], contradictions: ["broad_pale_petals"] },
      { stage: "mature_seed_head", plantPart: "fruit", diagnostic: ["spherical_pappus", "radial_filaments", "brown_receptacle", "bare_stalk"], contradictions: ["yellow_disc", "broad_white_petals"] },
      { stage: "vegetative", plantPart: "leaf", diagnostic: ["deeply_lobed_leaf", "basal_rosette"], contradictions: [] }
    ]
  },
  daisy: {
    name: "Common daisy",
    latin: "Bellis perennis",
    observations: [
      { stage: "flowering", plantPart: "flower", diagnostic: ["flat_white_rays", "yellow_disc", "low_bare_stalk"], contradictions: ["spherical_pappus"] }
    ]
  },
  poppy: {
    name: "Common poppy",
    latin: "Papaver rhoeas",
    observations: [
      { stage: "flowering", plantPart: "flower", diagnostic: ["four_broad_red_petals", "dark_centre", "hairy_stalk"], contradictions: ["many_narrow_rays"] },
      { stage: "fruiting", plantPart: "fruit", diagnostic: ["rounded_seed_capsule", "star_disc"], contradictions: ["petal_ring"] }
    ]
  },
  clover: {
    name: "Red clover",
    latin: "Trifolium pratense",
    observations: [
      { stage: "flowering", plantPart: "flower", diagnostic: ["compact_pink_head", "tiny_tubular_florets", "trifoliate_leaves"], contradictions: ["broad_layered_petals"] }
    ]
  },
  bluebell: {
    name: "Common bluebell",
    latin: "Hyacinthoides non-scripta",
    observations: [
      { stage: "bud", plantPart: "flower", diagnostic: ["clustered_closed_buds", "curved_stem"], contradictions: ["flat_disc"] },
      { stage: "flowering", plantPart: "flower", diagnostic: ["drooping_bells", "one_sided_raceme", "strap_leaves"], contradictions: ["single_flat_head"] }
    ]
  }
};
