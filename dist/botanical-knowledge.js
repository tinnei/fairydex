// Reference facts, separate from observations and pixel profiles.
const BOTANICAL_KNOWLEDGE = {
  "version": "1.0.0",
  "status": "source_backed_draft",
  "checkedAt": "2026-09-15",
  "countMeaning": "many means more than six; count one flower, or rays on one composite head. A missing count is not zero.",
  "sourcePolicy": "Trait encodings are developer interpretations of linked references, not expert-reviewed measurements. Related species and cultivars may fall outside these profiles.",
  "fields": {
    "stage": {
      "group": "stage",
      "label": "Growth stage",
      "values": [
        "flowering",
        "vegetative",
        "mature_seed_head",
        "fruiting"
      ],
      "weight": 1
    },
    "display": {
      "group": "flower",
      "label": "What makes the display?",
      "values": [
        "single_flower",
        "flower_cluster",
        "composite_head",
        "coloured_bracts"
      ],
      "weight": 2
    },
    "colour": {
      "group": "flower",
      "label": "Main flower / bract colour",
      "values": [
        "white",
        "pink",
        "red",
        "orange",
        "yellow",
        "purple",
        "blue"
      ],
      "weight": 0.5
    },
    "shape": {
      "group": "flower",
      "label": "Individual flower / head shape",
      "values": [
        "cup",
        "funnel",
        "flat_spreading",
        "star",
        "bell",
        "tubular",
        "ray_head",
        "irregular"
      ],
      "weight": 1.5
    },
    "countUnit": {
      "group": "flower",
      "label": "Counted part",
      "values": [
        "petal",
        "corolla_lobe",
        "tepal",
        "ray_floret",
        "bract"
      ],
      "weight": 0
    },
    "count": {
      "group": "flower",
      "label": "Count per flower (rays per head)",
      "values": [
        "3",
        "4",
        "5",
        "6",
        "many"
      ],
      "weight": 2
    },
    "centre": {
      "group": "flower",
      "label": "Centre feature",
      "values": [
        "staminal_column",
        "yellow_stamens",
        "yellow_disc",
        "dark_disc",
        "eyespot",
        "all_ray_florets",
        "green_inner_marks"
      ],
      "weight": 1.5
    },
    "orientation": {
      "group": "flower",
      "label": "Flower facing",
      "values": [
        "upward",
        "outward",
        "hanging"
      ],
      "weight": 0.5
    },
    "leafShape": {
      "group": "leaf",
      "label": "Leaf / leaflet outline",
      "values": [
        "oval",
        "lance",
        "linear",
        "spoon",
        "lobed",
        "round",
        "heart"
      ],
      "weight": 1
    },
    "leafType": {
      "group": "leaf",
      "label": "Leaf type",
      "values": [
        "simple",
        "compound",
        "trifoliate"
      ],
      "weight": 1.5
    },
    "leafArrangement": {
      "group": "leaf",
      "label": "Attachment pattern on stem",
      "values": [
        "alternate",
        "opposite",
        "whorled",
        "basal"
      ],
      "weight": 2
    },
    "leafMargin": {
      "group": "leaf",
      "label": "Leaf edge",
      "values": [
        "entire",
        "toothed",
        "lobed",
        "wavy"
      ],
      "weight": 0.75
    },
    "leafPosition": {
      "group": "leaf",
      "label": "Leaf position on plant",
      "values": [
        "basal",
        "along_stem",
        "branch_tips",
        "floating",
        "above_water"
      ],
      "weight": 1
    },
    "leafAttachment": {
      "group": "leaf",
      "label": "Aquatic leaf blade",
      "values": [
        "deep_notch",
        "peltate_complete"
      ],
      "weight": 2.5
    },
    "leafTexture": {
      "group": "leaf",
      "label": "Visible leaf surface",
      "values": [
        "glossy",
        "hairy",
        "rough",
        "succulent"
      ],
      "weight": 0.5
    },
    "growth": {
      "group": "context",
      "label": "Growth form",
      "values": [
        "herb",
        "shrub",
        "tree",
        "vine",
        "aquatic"
      ],
      "weight": 1
    },
    "habitat": {
      "group": "context",
      "label": "Rooted in",
      "values": [
        "land",
        "water"
      ],
      "weight": 1
    },
    "fruitForm": {
      "group": "fruit",
      "label": "Seed / fruit structure",
      "values": [
        "pappus_ball",
        "seed_disc",
        "perforated_receptacle",
        "capsule",
        "barbed_seeds"
      ],
      "weight": 2
    }
  },
  "plants": [
    {
      "id": "hibiscus",
      "name": "Hibiscus / 朱槿",
      "latin": "Hibiscus rosa-sinensis group",
      "referenceTaxon": "Hibiscus rosa-sinensis group",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/hibiscus-rosa-sinensis/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Five petals in typical single flowers; doubles vary. The projecting staminal column is more useful than colour.",
      "traits": {
        "display": {
          "values": [
            "single_flower"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "pink",
            "red",
            "white",
            "yellow",
            "orange"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "funnel"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "petal"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": {
          "values": [
            "5",
            "many"
          ],
          "sources": [
            "s1"
          ]
        },
        "centre": {
          "values": [
            "staminal_column"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "alternate"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "oval",
            "lobed"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "toothed"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafTexture": {
          "values": [
            "glossy"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "shrub"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "orientation": null,
        "leafPosition": null,
        "leafAttachment": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "legacy_experimental"
    },
    {
      "id": "ixora",
      "name": "Ixora / 龍船花",
      "latin": "Ixora",
      "referenceTaxon": "Ixora coccinea",
      "scopeNote": "Reference traits cover Ixora coccinea; not every species in this catalogue group.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/ixora-coccinea/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Count lobes of one small flower, not flowers in a cluster. Other Ixora species and cultivars need additional records.",
      "traits": {
        "display": {
          "values": [
            "flower_cluster"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "red"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "star",
            "tubular"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "corolla_lobe"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": {
          "values": [
            "4"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "opposite"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "oval"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "entire"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafTexture": {
          "values": [
            "glossy"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "shrub"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "centre": null,
        "orientation": null,
        "leafPosition": null,
        "leafAttachment": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "legacy_experimental"
    },
    {
      "id": "lantana",
      "name": "Lantana / 馬纓丹",
      "latin": "Lantana",
      "referenceTaxon": "Lantana camara",
      "scopeNote": "Reference traits cover Lantana camara; not every species in this catalogue group.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/lantana-camara/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Clusters can contain several colours. Lobe count is left unknown pending review of conflicting descriptions.",
      "traits": {
        "display": {
          "values": [
            "flower_cluster"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "pink",
            "yellow",
            "orange",
            "red",
            "white",
            "purple"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "tubular",
            "star"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "corolla_lobe"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "opposite",
            "whorled"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "oval"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "toothed"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafTexture": {
          "values": [
            "rough"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "shrub"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": null,
        "centre": null,
        "orientation": null,
        "leafPosition": null,
        "leafAttachment": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "legacy_experimental"
    },
    {
      "id": "plumeria",
      "name": "Frangipani / 雞蛋花",
      "latin": "Plumeria",
      "referenceTaxon": "Plumeria",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://www.nparks.gov.sg/florafaunaweb/flora/8/6/8620",
          "publisher": "NParks"
        },
        {
          "id": "s2",
          "url": "https://www.nparks.gov.sg/florafaunaweb/flora/3/0/3072",
          "publisher": "NParks"
        }
      ],
      "notes": "Large waxy flowers; leaf shape varies across species. Exact flower colour is left open for cultivar coverage.",
      "traits": {
        "display": {
          "values": [
            "flower_cluster"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "shape": {
          "values": [
            "funnel",
            "flat_spreading"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "countUnit": {
          "values": [
            "corolla_lobe"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "count": {
          "values": [
            "5"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafArrangement": {
          "values": [
            "alternate"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafPosition": {
          "values": [
            "branch_tips"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafShape": {
          "values": [
            "oval",
            "lance",
            "spoon"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafMargin": {
          "values": [
            "entire"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafTexture": {
          "values": [
            "glossy"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "growth": {
          "values": [
            "tree",
            "shrub"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "colour": null,
        "centre": null,
        "orientation": null,
        "leafAttachment": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "legacy_experimental"
    },
    {
      "id": "bougainvillea",
      "name": "Bougainvillea / 簕杜鵑",
      "latin": "Bougainvillea",
      "referenceTaxon": "Bougainvillea",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/bougainvillea/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "The colourful display is bracts; actual flowers are tiny tubes. Shape describes the true flower, colour describes the display. Bract count is not yet encoded.",
      "traits": {
        "display": {
          "values": [
            "coloured_bracts"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "pink",
            "purple",
            "red",
            "white",
            "yellow"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "tubular"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "bract"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "oval",
            "heart"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "entire"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "vine",
            "shrub"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": null,
        "centre": null,
        "orientation": null,
        "leafArrangement": null,
        "leafPosition": null,
        "leafAttachment": null,
        "leafTexture": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "legacy_experimental"
    },
    {
      "id": "bidens",
      "name": "Beggarticks / 鬼針草",
      "latin": "Bidens",
      "referenceTaxon": "Bidens alba",
      "scopeNote": "Reference traits cover Bidens alba; not every species in this catalogue group.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://www.nparks.gov.sg/florafaunaweb/flora/3/6/3616",
          "publisher": "NParks"
        }
      ],
      "notes": "This reference has five white rays; broader Bidens variation is not covered. Leaves change from simple to compound as the plant matures.",
      "traits": {
        "display": {
          "values": [
            "composite_head"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "white"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "ray_head"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "ray_floret"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": {
          "values": [
            "5"
          ],
          "sources": [
            "s1"
          ]
        },
        "centre": {
          "values": [
            "yellow_disc"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple",
            "compound"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "opposite"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "oval"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "toothed"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafTexture": {
          "values": [
            "hairy"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "herb"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "orientation": null,
        "leafPosition": null,
        "leafAttachment": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        },
        {
          "stage": "fruiting",
          "traits": {
            "fruitForm": {
              "values": [
                "barbed_seeds"
              ],
              "sources": [
                "s1"
              ]
            }
          }
        }
      ],
      "imageSupport": "legacy_experimental"
    },
    {
      "id": "waterlily",
      "name": "Water lily",
      "latin": "Nymphaea",
      "referenceTaxon": "Nymphaea",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/nymphaea/",
          "publisher": "NC State Extension"
        },
        {
          "id": "s2",
          "url": "https://www.nparks.gov.sg/florafaunaweb/flora/2/2/2271",
          "publisher": "NParks"
        },
        {
          "id": "s3",
          "url": "https://www.nparks.gov.sg/florafaunaweb/flora/8/7/8756",
          "publisher": "NParks"
        }
      ],
      "notes": "Look for a notch reaching into the leaf. Flower height alone cannot distinguish water lily from lotus.",
      "traits": {
        "display": {
          "values": [
            "single_flower"
          ],
          "sources": [
            "s1",
            "s2",
            "s3"
          ]
        },
        "colour": {
          "values": [
            "white",
            "pink",
            "red",
            "yellow",
            "orange",
            "purple",
            "blue"
          ],
          "sources": [
            "s1",
            "s2",
            "s3"
          ]
        },
        "shape": {
          "values": [
            "cup"
          ],
          "sources": [
            "s1",
            "s2",
            "s3"
          ]
        },
        "countUnit": {
          "values": [
            "petal"
          ],
          "sources": [
            "s1",
            "s2",
            "s3"
          ]
        },
        "count": {
          "values": [
            "many"
          ],
          "sources": [
            "s1",
            "s2",
            "s3"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1",
            "s2",
            "s3"
          ]
        },
        "leafShape": {
          "values": [
            "round"
          ],
          "sources": [
            "s1",
            "s2",
            "s3"
          ]
        },
        "leafMargin": {
          "values": [
            "entire",
            "wavy",
            "toothed"
          ],
          "sources": [
            "s1",
            "s2",
            "s3"
          ]
        },
        "leafPosition": {
          "values": [
            "floating"
          ],
          "sources": [
            "s1",
            "s2",
            "s3"
          ]
        },
        "leafAttachment": {
          "values": [
            "deep_notch"
          ],
          "sources": [
            "s1",
            "s2",
            "s3"
          ]
        },
        "growth": {
          "values": [
            "aquatic"
          ],
          "sources": [
            "s1",
            "s2",
            "s3"
          ]
        },
        "habitat": {
          "values": [
            "water"
          ],
          "sources": [
            "s1",
            "s2",
            "s3"
          ]
        },
        "centre": null,
        "orientation": null,
        "leafArrangement": null,
        "leafTexture": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "legacy_experimental"
    },
    {
      "id": "dandelion",
      "name": "Dandelion",
      "latin": "Taraxacum",
      "referenceTaxon": "Taraxacum officinale",
      "scopeNote": "Reference traits cover Taraxacum officinale; not every species in this catalogue group.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/taraxacum-officinale/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Flower heads contain ray florets; the white pappus ball belongs to a different stage. Reference descriptions disagree on leaf-type tags, so that field is unscored.",
      "traits": {
        "display": {
          "values": [
            "composite_head"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "yellow"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "ray_head"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "ray_floret"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": {
          "values": [
            "many"
          ],
          "sources": [
            "s1"
          ]
        },
        "centre": {
          "values": [
            "all_ray_florets"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "lobed"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "basal"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "lobed",
            "toothed"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafPosition": {
          "values": [
            "basal"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "herb"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "orientation": null,
        "leafType": null,
        "leafAttachment": null,
        "leafTexture": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        },
        {
          "stage": "mature_seed_head",
          "traits": {
            "fruitForm": {
              "values": [
                "pappus_ball"
              ],
              "sources": [
                "s1"
              ]
            }
          }
        }
      ],
      "imageSupport": "legacy_experimental"
    },
    {
      "id": "daisy",
      "name": "Common daisy",
      "latin": "Bellis perennis",
      "referenceTaxon": "Bellis perennis",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/bellis-perennis/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Many rays around a yellow disc. Double cultivars may hide the centre.",
      "traits": {
        "display": {
          "values": [
            "composite_head"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "white",
            "pink",
            "red"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "ray_head"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "ray_floret"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": {
          "values": [
            "many"
          ],
          "sources": [
            "s1"
          ]
        },
        "centre": {
          "values": [
            "yellow_disc"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "spoon",
            "oval",
            "lance"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "basal"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafPosition": {
          "values": [
            "basal"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "toothed",
            "lobed"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "herb"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "orientation": null,
        "leafAttachment": null,
        "leafTexture": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "legacy_experimental"
    },
    {
      "id": "poppy",
      "name": "Poppy",
      "latin": "Papaver",
      "referenceTaxon": "Papaver rhoeas",
      "scopeNote": "Reference traits cover Papaver rhoeas; not every species in this catalogue group.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/papaver-rhoeas/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Typical single flowers have four broad petals. Double garden forms are outside this reference.",
      "traits": {
        "display": {
          "values": [
            "single_flower"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "red",
            "white",
            "purple"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "cup"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "petal"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": {
          "values": [
            "4"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "lobed"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "alternate"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "lobed",
            "toothed"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafTexture": {
          "values": [
            "hairy",
            "rough"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "herb"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "centre": null,
        "orientation": null,
        "leafPosition": null,
        "leafAttachment": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        },
        {
          "stage": "fruiting",
          "traits": {
            "fruitForm": {
              "values": [
                "capsule"
              ],
              "sources": [
                "s1"
              ]
            }
          }
        }
      ],
      "imageSupport": "legacy_experimental"
    },
    {
      "id": "clover",
      "name": "Clover",
      "latin": "Trifolium",
      "referenceTaxon": "Trifolium pratense",
      "scopeNote": "Reference traits cover Trifolium pratense; not every species in this catalogue group.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/trifolium-pratense/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Count within one tiny flower, not the entire head. Three leaflets and pale leaflet markings help; other clovers need their own references.",
      "traits": {
        "display": {
          "values": [
            "flower_cluster"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "pink",
            "purple"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "tubular"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "petal"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": {
          "values": [
            "5"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "trifoliate"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "oval"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "alternate"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "entire",
            "toothed"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafTexture": {
          "values": [
            "hairy"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "herb"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "centre": null,
        "orientation": null,
        "leafPosition": null,
        "leafAttachment": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "legacy_experimental"
    },
    {
      "id": "bluebell",
      "name": "Bluebell",
      "latin": "Hyacinthoides",
      "referenceTaxon": "Hyacinthoides non-scripta",
      "scopeNote": "Reference traits cover Hyacinthoides non-scripta; not every species in this catalogue group.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://www.rhs.org.uk/weeds/bluebells-as-weeds",
          "publisher": "RHS"
        }
      ],
      "notes": "English bluebells have nodding stems with flowers to one side. Spanish bluebells and hybrids need separate records; segment count is not encoded yet.",
      "traits": {
        "display": {
          "values": [
            "flower_cluster"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "blue",
            "white",
            "pink"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "bell"
          ],
          "sources": [
            "s1"
          ]
        },
        "orientation": {
          "values": [
            "hanging"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "linear"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafPosition": {
          "values": [
            "basal"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "basal"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "herb"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": null,
        "count": null,
        "centre": null,
        "leafMargin": null,
        "leafAttachment": null,
        "leafTexture": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "legacy_experimental"
    },
    {
      "id": "periwinkle",
      "name": "Madagascar periwinkle / 長春花",
      "latin": "Catharanthus roseus",
      "referenceTaxon": "Catharanthus roseus",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/catharanthus-roseus/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Five spreading corolla lobes over a slender tube; opposite glossy leaves often show a pale midrib.",
      "traits": {
        "display": {
          "values": [
            "single_flower"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "pink",
            "purple",
            "white",
            "red"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "flat_spreading",
            "tubular"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "corolla_lobe"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": {
          "values": [
            "5"
          ],
          "sources": [
            "s1"
          ]
        },
        "centre": {
          "values": [
            "eyespot"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "oval",
            "spoon"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "opposite"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "entire"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafTexture": {
          "values": [
            "glossy"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "herb",
            "shrub"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "orientation": null,
        "leafPosition": null,
        "leafAttachment": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "not_connected"
    },
    {
      "id": "pentas",
      "name": "Egyptian starcluster / 五星花",
      "latin": "Pentas lanceolata",
      "referenceTaxon": "Pentas lanceolata",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/pentas-lanceolata/",
          "publisher": "NC State Extension"
        },
        {
          "id": "s2",
          "url": "https://www.nparks.gov.sg/florafaunaweb/flora/3/2/3232",
          "publisher": "NParks"
        }
      ],
      "notes": "Count five lobes on one flower. Leaf hairs can help when comparing with the Ixora reference.",
      "traits": {
        "display": {
          "values": [
            "flower_cluster"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "colour": {
          "values": [
            "pink",
            "red",
            "purple",
            "white"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "shape": {
          "values": [
            "star",
            "tubular"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "countUnit": {
          "values": [
            "corolla_lobe"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "count": {
          "values": [
            "5"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafShape": {
          "values": [
            "lance",
            "oval"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafArrangement": {
          "values": [
            "opposite"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafMargin": {
          "values": [
            "entire"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafTexture": {
          "values": [
            "hairy"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "growth": {
          "values": [
            "herb",
            "shrub"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "centre": null,
        "orientation": null,
        "leafPosition": null,
        "leafAttachment": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "not_connected"
    },
    {
      "id": "allamanda",
      "name": "Golden trumpet / 軟枝黃蟬",
      "latin": "Allamanda cathartica",
      "referenceTaxon": "Allamanda cathartica",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/allamanda-cathartica/",
          "publisher": "NC State Extension"
        },
        {
          "id": "s2",
          "url": "https://www.nparks.gov.sg/florafaunaweb/flora/1/3/1303",
          "publisher": "NParks"
        }
      ],
      "notes": "Yellow trumpet form; other colour cultivars require additional coverage.",
      "traits": {
        "display": {
          "values": [
            "flower_cluster"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "colour": {
          "values": [
            "yellow"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "shape": {
          "values": [
            "funnel",
            "tubular"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "countUnit": {
          "values": [
            "corolla_lobe"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "count": {
          "values": [
            "5"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafShape": {
          "values": [
            "lance"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafArrangement": {
          "values": [
            "opposite",
            "whorled"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafTexture": {
          "values": [
            "glossy"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "growth": {
          "values": [
            "vine",
            "shrub"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "centre": null,
        "orientation": null,
        "leafMargin": null,
        "leafPosition": null,
        "leafAttachment": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "not_connected"
    },
    {
      "id": "canna",
      "name": "Canna / 美人蕉",
      "latin": "Canna indica",
      "referenceTaxon": "Canna indica",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/canna-indica/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Complex showy floral structures are not given a simple petal count. Garden hybrids can differ substantially.",
      "traits": {
        "display": {
          "values": [
            "flower_cluster"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "red",
            "orange",
            "yellow"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "irregular",
            "tubular"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "oval",
            "lance"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "alternate",
            "basal"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "entire"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "herb"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": null,
        "count": null,
        "centre": null,
        "orientation": null,
        "leafPosition": null,
        "leafAttachment": null,
        "leafTexture": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "not_connected"
    },
    {
      "id": "lotus",
      "name": "Lotus / 荷花",
      "latin": "Nelumbo nucifera",
      "referenceTaxon": "Nelumbo nucifera",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/nelumbo-nucifera/",
          "publisher": "NC State Extension"
        },
        {
          "id": "s2",
          "url": "https://www.nparks.gov.sg/florafaunaweb/flora/2/2/2271",
          "publisher": "NParks"
        }
      ],
      "notes": "A complete round blade attaches underneath near its centre. Mature foliage is often raised; young floating leaves can occur. Petal count remains unspecified.",
      "traits": {
        "display": {
          "values": [
            "single_flower"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "colour": {
          "values": [
            "pink",
            "white"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "shape": {
          "values": [
            "cup"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafShape": {
          "values": [
            "round"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafMargin": {
          "values": [
            "entire",
            "wavy"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafPosition": {
          "values": [
            "above_water",
            "floating"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "leafAttachment": {
          "values": [
            "peltate_complete"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "growth": {
          "values": [
            "aquatic"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "habitat": {
          "values": [
            "water"
          ],
          "sources": [
            "s1",
            "s2"
          ]
        },
        "countUnit": null,
        "count": null,
        "centre": null,
        "orientation": null,
        "leafType": null,
        "leafArrangement": null,
        "leafTexture": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        },
        {
          "stage": "fruiting",
          "traits": {
            "fruitForm": {
              "values": [
                "perforated_receptacle"
              ],
              "sources": [
                "s1"
              ]
            }
          }
        }
      ],
      "imageSupport": "not_connected"
    },
    {
      "id": "moss-rose",
      "name": "Moss rose / 大花馬齒莧",
      "latin": "Portulaca grandiflora",
      "referenceTaxon": "Portulaca grandiflora",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/portulaca-grandiflora/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Needle-like fleshy leaves; five petals in single flowers, more in doubles.",
      "traits": {
        "display": {
          "values": [
            "single_flower"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "pink",
            "red",
            "orange",
            "yellow",
            "white",
            "purple"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "cup",
            "flat_spreading"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "petal"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": {
          "values": [
            "5",
            "many"
          ],
          "sources": [
            "s1"
          ]
        },
        "orientation": {
          "values": [
            "upward"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "linear"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "alternate",
            "whorled"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "entire"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafTexture": {
          "values": [
            "succulent"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "herb"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "centre": null,
        "leafType": null,
        "leafPosition": null,
        "leafAttachment": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "not_connected"
    },
    {
      "id": "rain-lily",
      "name": "White rain lily / 蔥蓮",
      "latin": "Zephyranthes candida",
      "referenceTaxon": "Zephyranthes candida",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/zephyranthes-candida/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Six white segments and orange-yellow anthers; narrow leaves rise from the base.",
      "traits": {
        "display": {
          "values": [
            "single_flower"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "white"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "star"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "tepal"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": {
          "values": [
            "6"
          ],
          "sources": [
            "s1"
          ]
        },
        "centre": {
          "values": [
            "yellow_stamens"
          ],
          "sources": [
            "s1"
          ]
        },
        "orientation": {
          "values": [
            "upward"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "linear",
            "lance"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "basal"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafPosition": {
          "values": [
            "basal"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "entire"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "herb"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafAttachment": null,
        "leafTexture": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "not_connected"
    },
    {
      "id": "crape-myrtle",
      "name": "Queen’s crape myrtle / 大花紫薇",
      "latin": "Lagerstroemia speciosa",
      "referenceTaxon": "Lagerstroemia speciosa",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/lagerstroemia-speciosa/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Six petals per flower in terminal panicles. Unverified arrangement and margin fields remain unknown.",
      "traits": {
        "display": {
          "values": [
            "flower_cluster"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "pink",
            "purple"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "petal"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": {
          "values": [
            "6"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "oval"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "tree"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": null,
        "centre": null,
        "orientation": null,
        "leafArrangement": null,
        "leafMargin": null,
        "leafPosition": null,
        "leafAttachment": null,
        "leafTexture": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "not_connected"
    },
    {
      "id": "sunflower",
      "name": "Sunflower / 向日葵",
      "latin": "Helianthus annuus",
      "referenceTaxon": "Helianthus annuus",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/helianthus-annuus/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Rays surround a disc of tiny flowers. Lower leaves can be opposite, upper leaves alternate. Doubles may obscure the disc.",
      "traits": {
        "display": {
          "values": [
            "composite_head"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "yellow",
            "orange",
            "red",
            "purple"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "ray_head"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "ray_floret"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": {
          "values": [
            "many"
          ],
          "sources": [
            "s1"
          ]
        },
        "centre": {
          "values": [
            "dark_disc"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "oval",
            "lance"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "alternate",
            "opposite"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafPosition": {
          "values": [
            "along_stem"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "toothed"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafTexture": {
          "values": [
            "rough",
            "hairy"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "herb"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "orientation": null,
        "leafAttachment": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "not_connected"
    },
    {
      "id": "snowdrop",
      "name": "Snowdrop / 雪滴花",
      "latin": "Galanthus nivalis",
      "referenceTaxon": "Galanthus nivalis",
      "scopeNote": "Typical form; cultivated varieties may differ.",
      "reviewStatus": "source_backed_draft",
      "reviewedAt": "2026-09-15",
      "sources": [
        {
          "id": "s1",
          "url": "https://plants.ces.ncsu.edu/plants/galanthus-nivalis/",
          "publisher": "NC State Extension"
        }
      ],
      "notes": "Three long outer tepals and three shorter inner tepals with green marks. Count all six, not just the three outer ones. Extra reference target; Macau occurrence unconfirmed.",
      "traits": {
        "display": {
          "values": [
            "single_flower"
          ],
          "sources": [
            "s1"
          ]
        },
        "colour": {
          "values": [
            "white"
          ],
          "sources": [
            "s1"
          ]
        },
        "shape": {
          "values": [
            "bell"
          ],
          "sources": [
            "s1"
          ]
        },
        "countUnit": {
          "values": [
            "tepal"
          ],
          "sources": [
            "s1"
          ]
        },
        "count": {
          "values": [
            "6"
          ],
          "sources": [
            "s1"
          ]
        },
        "centre": {
          "values": [
            "green_inner_marks"
          ],
          "sources": [
            "s1"
          ]
        },
        "orientation": {
          "values": [
            "hanging"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafType": {
          "values": [
            "simple"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafShape": {
          "values": [
            "linear",
            "lance"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafArrangement": {
          "values": [
            "basal"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafPosition": {
          "values": [
            "basal"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafMargin": {
          "values": [
            "entire"
          ],
          "sources": [
            "s1"
          ]
        },
        "growth": {
          "values": [
            "herb"
          ],
          "sources": [
            "s1"
          ]
        },
        "habitat": {
          "values": [
            "land"
          ],
          "sources": [
            "s1"
          ]
        },
        "leafAttachment": null,
        "leafTexture": null
      },
      "stages": [
        {
          "stage": "flowering",
          "traits": {}
        },
        {
          "stage": "vegetative",
          "traits": {}
        }
      ],
      "imageSupport": "not_connected"
    }
  ]
};
if(typeof module!=="undefined")module.exports=BOTANICAL_KNOWLEDGE;
