// Vygenerováno skriptem design/generator/tokeny.py z palettes.py a tpls.py. Ručně needitovat.
import type { Sablona } from './typy'

export const SABLONY: readonly Sablona[] = [
  {
    "klic": "naves",
    "cislo": "01",
    "nazev": "Náves",
    "podtitul": "Pro vesnice do 500 obyvatel.",
    "inspirace": "TownPress (LSVRthemes) – portál ve třech sloupcích přes panoráma obce",
    "pismo": {
      "googleFonts": "family=Bricolage+Grotesque:opsz,wght@12..96,400..600",
      "family": "'Bricolage Grotesque', system-ui, sans-serif",
      "popis": "Bricolage Grotesque (nadpisy i text)",
      "rodiny": [
        {
          "rodina": "Bricolage Grotesque",
          "osy": [
            "opsz",
            "wght"
          ],
          "hodnoty": "12..96,400..600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "info",
    "prototyp": "Main.dc.html",
    "zdroj": "Main",
    "interaktivni": false,
    "palety": [
      {
        "nazev": "Luční",
        "bg": "#FBFBF7",
        "surface": "#EEF3E4",
        "ink": "#1E2A22",
        "muted": "#4F5B52",
        "line": "#C9D3C3",
        "primary": "#2F5D3A",
        "onPrimary": "#FFFFFF",
        "link": "#2F5D3A",
        "accent": "#E3B23C",
        "onAccent": "#1E2A22",
        "deep": "#2F5D3A",
        "onDeep": "#FBFBF7",
        "extra": {
          "hill": "#D4E2B4",
          "meadow": "#A9C46C",
          "roof": "#C9962A"
        }
      },
      {
        "nazev": "Modrotisk",
        "bg": "#F7F8FB",
        "surface": "#E6ECF5",
        "ink": "#14213D",
        "muted": "#4A5670",
        "line": "#C5CFDF",
        "primary": "#1F3F7A",
        "onPrimary": "#FFFFFF",
        "link": "#1F3F7A",
        "accent": "#F0B429",
        "onAccent": "#14213D",
        "deep": "#14213D",
        "onDeep": "#F7F8FB",
        "extra": {
          "hill": "#C9D6EC",
          "meadow": "#8FA7D6",
          "roof": "#C98E12"
        }
      },
      {
        "nazev": "Šípek",
        "bg": "#FFFAF8",
        "surface": "#F6E6E4",
        "ink": "#2A1416",
        "muted": "#6A4B4E",
        "line": "#E5C9C7",
        "primary": "#9E1F35",
        "onPrimary": "#FFFFFF",
        "link": "#9E1F35",
        "accent": "#F2A541",
        "onAccent": "#2A1416",
        "deep": "#4A1220",
        "onDeep": "#FFFAF8",
        "extra": {
          "hill": "#F1D3CF",
          "meadow": "#D99A92",
          "roof": "#D27C1E"
        }
      }
    ]
  },
  {
    "klic": "zvonice",
    "cislo": "02",
    "nazev": "Zvonice",
    "podtitul": "Pro vesnice, kde starosta chce minimum práce.",
    "inspirace": "GOV.UK Design System – jeden sloupec a úřední deska s filtrem",
    "pismo": {
      "googleFonts": "family=Hanken+Grotesk:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400..600",
      "family": "'Hanken Grotesk', system-ui, sans-serif",
      "popis": "Newsreader (nadpisy) a Hanken Grotesk (text)",
      "rodiny": [
        {
          "rodina": "Hanken Grotesk",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        },
        {
          "rodina": "Newsreader",
          "osy": [
            "opsz",
            "wght"
          ],
          "hodnoty": "6..72,400..600"
        }
      ]
    },
    "velikostTextu": "18px",
    "radkovani": "1.6",
    "vychoziKrize": "info",
    "prototyp": "S02-Zvonice.dc.html",
    "zdroj": "S02-Zvonice",
    "interaktivni": true,
    "palety": [
      {
        "nazev": "Inkoust",
        "bg": "#FFFFFF",
        "surface": "#F3F5F8",
        "ink": "#16233A",
        "muted": "#4A5568",
        "line": "#C9CFD8",
        "primary": "#2B4C7E",
        "onPrimary": "#FFFFFF",
        "link": "#2B4C7E",
        "accent": "#B3261E",
        "onAccent": "#FFFFFF",
        "deep": "#16233A",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Grafit",
        "bg": "#FAFAF9",
        "surface": "#EFEFEC",
        "ink": "#1C1C1A",
        "muted": "#57574F",
        "line": "#D4D4CE",
        "primary": "#3D3D38",
        "onPrimary": "#FFFFFF",
        "link": "#3D3D38",
        "accent": "#C2410C",
        "onAccent": "#FFFFFF",
        "deep": "#1C1C1A",
        "onDeep": "#FAFAF9",
        "extra": {}
      },
      {
        "nazev": "Mech",
        "bg": "#FBFCF8",
        "surface": "#EEF2E6",
        "ink": "#1D2617",
        "muted": "#515C46",
        "line": "#CED6C2",
        "primary": "#4A6B2A",
        "onPrimary": "#FFFFFF",
        "link": "#3E5C22",
        "accent": "#8A5A00",
        "onAccent": "#FFFFFF",
        "deep": "#1D2617",
        "onDeep": "#FBFCF8",
        "extra": {}
      }
    ]
  },
  {
    "klic": "studanka",
    "cislo": "03",
    "nazev": "Studánka",
    "podtitul": "Pro rekreační obce s chalupáři.",
    "inspirace": "Wordbench (LSVRthemes) – dělený úvod, karta hledání a rozcestník",
    "pismo": {
      "googleFonts": "family=Alegreya:wght@500;600&family=Alegreya+Sans:wght@400;500;600",
      "family": "'Alegreya Sans', system-ui, sans-serif",
      "popis": "Alegreya (nadpisy) a Alegreya Sans (text)",
      "rodiny": [
        {
          "rodina": "Alegreya",
          "osy": [
            "wght"
          ],
          "hodnoty": "500;600"
        },
        {
          "rodina": "Alegreya Sans",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "18px",
    "radkovani": "1.55",
    "vychoziKrize": "off",
    "prototyp": "S03-Studanka.dc.html",
    "zdroj": "S03-Studanka",
    "interaktivni": true,
    "palety": [
      {
        "nazev": "Les",
        "bg": "#F4F6F2",
        "surface": "#FFFFFF",
        "ink": "#14211E",
        "muted": "#4C5A56",
        "line": "#CFD9D4",
        "primary": "#1F4D45",
        "onPrimary": "#FFFFFF",
        "link": "#1F4D45",
        "accent": "#8FC7C1",
        "onAccent": "#14211E",
        "deep": "#1F4D45",
        "onDeep": "#F4F6F2",
        "extra": {
          "tree": "#1F4D45",
          "tree2": "#2C6358",
          "water": "#5FA9A1",
          "sky": "#DCEFEA",
          "meadow": "#A8B97A"
        }
      },
      {
        "nazev": "Vřes",
        "bg": "#F7F4F8",
        "surface": "#FFFFFF",
        "ink": "#22172A",
        "muted": "#5A4C63",
        "line": "#DCD2E2",
        "primary": "#5B3A6E",
        "onPrimary": "#FFFFFF",
        "link": "#5B3A6E",
        "accent": "#C9A6D9",
        "onAccent": "#22172A",
        "deep": "#3A2448",
        "onDeep": "#F7F4F8",
        "extra": {
          "tree": "#3A2448",
          "tree2": "#5B3A6E",
          "water": "#7FA8CC",
          "sky": "#EDE4F1",
          "meadow": "#B9A6C4"
        }
      },
      {
        "nazev": "Kámen",
        "bg": "#F3F4F5",
        "surface": "#FFFFFF",
        "ink": "#1B2025",
        "muted": "#4F5861",
        "line": "#D3D8DD",
        "primary": "#36505F",
        "onPrimary": "#FFFFFF",
        "link": "#2F4856",
        "accent": "#E0B65A",
        "onAccent": "#1B2025",
        "deep": "#1B2025",
        "onDeep": "#F3F4F5",
        "extra": {
          "tree": "#2B3C47",
          "tree2": "#4D6878",
          "water": "#7E9EB2",
          "sky": "#E3E8EC",
          "meadow": "#B9C2A0"
        }
      }
    ]
  },
  {
    "klic": "lipa",
    "cislo": "04",
    "nazev": "Lípa",
    "podtitul": "Výchozí šablona pro obce 500 až 2 000 obyvatel.",
    "inspirace": "BetterLocalGov a Town Hall – úkoly slovesem a informační karty",
    "pismo": {
      "googleFonts": "family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif",
      "family": "'Instrument Sans', system-ui, sans-serif",
      "popis": "Instrument Serif (nadpisy) a Instrument Sans (text)",
      "rodiny": [
        {
          "rodina": "Instrument Sans",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        },
        {
          "rodina": "Instrument Serif",
          "osy": [],
          "hodnoty": ""
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "info",
    "prototyp": "S04-Lipa.dc.html",
    "zdroj": "S04-Lipa",
    "interaktivni": true,
    "palety": [
      {
        "nazev": "Lipová",
        "bg": "#FFFFFF",
        "surface": "#EEF3E6",
        "ink": "#1B231A",
        "muted": "#4E5A4B",
        "line": "#DCE3D3",
        "primary": "#3F6B2A",
        "onPrimary": "#FFFFFF",
        "link": "#3F6B2A",
        "accent": "#C9DCA9",
        "onAccent": "#1B231A",
        "deep": "#28461A",
        "onDeep": "#EEF3E6",
        "extra": {}
      },
      {
        "nazev": "Obloha",
        "bg": "#FFFFFF",
        "surface": "#EAF2FA",
        "ink": "#13202E",
        "muted": "#4A5868",
        "line": "#D3DFEB",
        "primary": "#1E5A96",
        "onPrimary": "#FFFFFF",
        "link": "#1E5A96",
        "accent": "#9CC3E6",
        "onAccent": "#13202E",
        "deep": "#123B63",
        "onDeep": "#EAF2FA",
        "extra": {}
      },
      {
        "nazev": "Švestka",
        "bg": "#FFFFFF",
        "surface": "#F3ECF4",
        "ink": "#24152A",
        "muted": "#5E4C64",
        "line": "#E3D6E6",
        "primary": "#6B2D73",
        "onPrimary": "#FFFFFF",
        "link": "#6B2D73",
        "accent": "#D7B6DD",
        "onAccent": "#24152A",
        "deep": "#3D1844",
        "onDeep": "#F3ECF4",
        "extra": {}
      }
    ]
  },
  {
    "klic": "majka",
    "cislo": "05",
    "nazev": "Májka",
    "podtitul": "Pro obce s bohatým spolkovým životem.",
    "inspirace": "Pressville (LSVRthemes) – akce s velkým bledým slovem a karty plakátů",
    "pismo": {
      "googleFonts": "family=Big+Shoulders:wght@500;600&family=Karla:wght@400;500;600",
      "family": "'Karla', system-ui, sans-serif",
      "popis": "Big Shoulders (plakáty a nadpisy) a Karla (text)",
      "rodiny": [
        {
          "rodina": "Big Shoulders",
          "osy": [
            "wght"
          ],
          "hodnoty": "500;600"
        },
        {
          "rodina": "Karla",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "off",
    "prototyp": "S05-Majka.dc.html",
    "zdroj": "S05-Majka",
    "interaktivni": false,
    "palety": [
      {
        "nazev": "Stužky",
        "bg": "#E9ECEF",
        "surface": "#FFFFFF",
        "ink": "#15171A",
        "muted": "#4A4F57",
        "line": "#C9CED4",
        "primary": "#B8322A",
        "onPrimary": "#FFFFFF",
        "link": "#1F4A94",
        "accent": "#F2C230",
        "onAccent": "#15171A",
        "deep": "#15171A",
        "onDeep": "#FFFFFF",
        "extra": {
          "r1": "#B8322A",
          "r1i": "#FFFFFF",
          "r2": "#F2C230",
          "r2i": "#15171A",
          "r3": "#2A55A5",
          "r3i": "#FFFFFF",
          "r4": "#2E7D4F",
          "r4i": "#FFFFFF"
        }
      },
      {
        "nazev": "Kroj",
        "bg": "#EEEEF1",
        "surface": "#FFFFFF",
        "ink": "#1A1414",
        "muted": "#524848",
        "line": "#D2CCCC",
        "primary": "#8E1B2C",
        "onPrimary": "#FFFFFF",
        "link": "#8E1B2C",
        "accent": "#E7B10A",
        "onAccent": "#1A1414",
        "deep": "#1A1414",
        "onDeep": "#FFFFFF",
        "extra": {
          "r1": "#8E1B2C",
          "r1i": "#FFFFFF",
          "r2": "#E7B10A",
          "r2i": "#1A1414",
          "r3": "#1F5E5B",
          "r3i": "#FFFFFF",
          "r4": "#3B3B7A",
          "r4i": "#FFFFFF"
        }
      },
      {
        "nazev": "Noc",
        "bg": "#15171C",
        "surface": "#20232A",
        "ink": "#F1F2F4",
        "muted": "#AEB3BC",
        "line": "#343843",
        "primary": "#FF6B57",
        "onPrimary": "#15171C",
        "link": "#8FB8FF",
        "accent": "#FFD24D",
        "onAccent": "#15171C",
        "deep": "#0C0D10",
        "onDeep": "#F1F2F4",
        "extra": {
          "r1": "#FF6B57",
          "r1i": "#15171C",
          "r2": "#FFD24D",
          "r2i": "#15171C",
          "r3": "#7FA6FF",
          "r3i": "#15171C",
          "r4": "#4CC38A",
          "r4i": "#15171C"
        }
      }
    ]
  },
  {
    "klic": "hnizdo",
    "cislo": "06",
    "nazev": "Hnízdo",
    "podtitul": "Pro obce s mladými rodinami.",
    "inspirace": "CityGov (Dannci) – teplé dlaždice přes spodní hranu úvodu",
    "pismo": {
      "googleFonts": "family=Gabarito:wght@400;500;600",
      "family": "'Gabarito', system-ui, sans-serif",
      "popis": "Gabarito (nadpisy i text)",
      "rodiny": [
        {
          "rodina": "Gabarito",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "info",
    "prototyp": "S06-Hnizdo.dc.html",
    "zdroj": "S06-Hnizdo",
    "interaktivni": false,
    "palety": [
      {
        "nazev": "Meruňka",
        "bg": "#FFFFFF",
        "surface": "#FCE3CF",
        "ink": "#24282F",
        "muted": "#555B66",
        "line": "#F2C6A5",
        "primary": "#9A4416",
        "onPrimary": "#FFFFFF",
        "link": "#9A4416",
        "accent": "#D6E9F7",
        "onAccent": "#24282F",
        "deep": "#24282F",
        "onDeep": "#FFFFFF",
        "extra": {
          "go": "#2E6B2A"
        }
      },
      {
        "nazev": "Pastelka",
        "bg": "#FFFFFF",
        "surface": "#E3F1E8",
        "ink": "#1E2B24",
        "muted": "#4E5D55",
        "line": "#BFDCC9",
        "primary": "#1F6B4F",
        "onPrimary": "#FFFFFF",
        "link": "#1F6B4F",
        "accent": "#FFE3A3",
        "onAccent": "#1E2B24",
        "deep": "#1E2B24",
        "onDeep": "#FFFFFF",
        "extra": {
          "go": "#1F6B4F"
        }
      },
      {
        "nazev": "Borůvka",
        "bg": "#FFFFFF",
        "surface": "#E7E9FB",
        "ink": "#1C1F33",
        "muted": "#50546E",
        "line": "#C9CDF0",
        "primary": "#3B43A8",
        "onPrimary": "#FFFFFF",
        "link": "#3B43A8",
        "accent": "#FFD8C2",
        "onAccent": "#1C1F33",
        "deep": "#1C1F33",
        "onDeep": "#FFFFFF",
        "extra": {
          "go": "#3B43A8"
        }
      }
    ]
  },
  {
    "klic": "hranice",
    "cislo": "07",
    "nazev": "Hranice",
    "podtitul": "Pro obce u hranice, česky i německy.",
    "inspirace": "Pressville (LSVRthemes) – znak a serifový název přes panoráma, lišta s jazyky",
    "pismo": {
      "googleFonts": "family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:wght@500",
      "family": "'IBM Plex Sans', system-ui, sans-serif",
      "popis": "IBM Plex Serif (nadpisy) a IBM Plex Sans (text)",
      "rodiny": [
        {
          "rodina": "IBM Plex Sans",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        },
        {
          "rodina": "IBM Plex Serif",
          "osy": [
            "wght"
          ],
          "hodnoty": "500"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "info",
    "prototyp": "S07-Hranice.dc.html",
    "zdroj": "S07-Hranice",
    "interaktivni": true,
    "palety": [
      {
        "nazev": "Šumava",
        "bg": "#FFFFFF",
        "surface": "#EEF3F6",
        "ink": "#13202B",
        "muted": "#4A5866",
        "line": "#CCD7DF",
        "primary": "#1D4E6F",
        "onPrimary": "#FFFFFF",
        "link": "#1D4E6F",
        "accent": "#F2C14E",
        "onAccent": "#13202B",
        "deep": "#2F5233",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Bavorsko",
        "bg": "#FFFFFF",
        "surface": "#EDF4FB",
        "ink": "#0F1E2E",
        "muted": "#45576A",
        "line": "#C8D8E8",
        "primary": "#1460A8",
        "onPrimary": "#FFFFFF",
        "link": "#0F5596",
        "accent": "#9FC9F0",
        "onAccent": "#0F1E2E",
        "deep": "#0F2E4D",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Hraniční kámen",
        "bg": "#FAFAF8",
        "surface": "#EFEEE9",
        "ink": "#1F1E1A",
        "muted": "#56544C",
        "line": "#D6D3C9",
        "primary": "#7A2E2E",
        "onPrimary": "#FFFFFF",
        "link": "#7A2E2E",
        "accent": "#D9B26A",
        "onAccent": "#1F1E1A",
        "deep": "#2E2D29",
        "onDeep": "#FAFAF8",
        "extra": {}
      }
    ]
  },
  {
    "klic": "vinice",
    "cislo": "08",
    "nazev": "Vinice",
    "podtitul": "Pro vinařské obce a obce s místními výrobci.",
    "inspirace": "CityGov (AncoraThemes) – editoriální koláž, bledý nápis a šachovnice karet",
    "pismo": {
      "googleFonts": "family=Fraunces:opsz,wght@9..144,400..600&family=Figtree:wght@400;500;600",
      "family": "'Figtree', system-ui, sans-serif",
      "popis": "Fraunces (nadpisy) a Figtree (text)",
      "rodiny": [
        {
          "rodina": "Fraunces",
          "osy": [
            "opsz",
            "wght"
          ],
          "hodnoty": "9..144,400..600"
        },
        {
          "rodina": "Figtree",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "off",
    "prototyp": "S08-Vinice.dc.html",
    "zdroj": "S08-Vinice",
    "interaktivni": false,
    "palety": [
      {
        "nazev": "Bez",
        "bg": "#FFFFFF",
        "surface": "#F6EFEE",
        "ink": "#2A1218",
        "muted": "#5E4A4F",
        "line": "#E3D3D4",
        "primary": "#6E1E3A",
        "onPrimary": "#FFFFFF",
        "link": "#6E1E3A",
        "accent": "#D9C49A",
        "onAccent": "#2A1218",
        "deep": "#6E1E3A",
        "onDeep": "#FFFFFF",
        "extra": {
          "row": "#5E7A2E",
          "row2": "#D9C49A"
        }
      },
      {
        "nazev": "Žito",
        "bg": "#FFFFFF",
        "surface": "#F4F3E3",
        "ink": "#22230F",
        "muted": "#56583E",
        "line": "#DEDDBE",
        "primary": "#5E6B12",
        "onPrimary": "#FFFFFF",
        "link": "#4F5A0E",
        "accent": "#E8D36A",
        "onAccent": "#22230F",
        "deep": "#2E3410",
        "onDeep": "#F4F3E3",
        "extra": {
          "row": "#5E6B12",
          "row2": "#E8D36A"
        }
      },
      {
        "nazev": "Sklep",
        "bg": "#1B1517",
        "surface": "#261E21",
        "ink": "#F3ECEC",
        "muted": "#BBAFB2",
        "line": "#3A2F33",
        "primary": "#E2A6B6",
        "onPrimary": "#1B1517",
        "link": "#F0B8C6",
        "accent": "#D9C49A",
        "onAccent": "#1B1517",
        "deep": "#120E0F",
        "onDeep": "#F3ECEC",
        "extra": {
          "row": "#7E9A4E",
          "row2": "#5A4A3A"
        }
      }
    ]
  },
  {
    "klic": "hreben",
    "cislo": "09",
    "nazev": "Hřeben",
    "podtitul": "Pro horské a turistické obce.",
    "inspirace": "Administration (axiomthemes) – obří titulek přes panoráma a číslované služby",
    "pismo": {
      "googleFonts": "family=Archivo:wdth,wght@62..125,400..600",
      "family": "'Archivo', system-ui, sans-serif",
      "popis": "Archivo v úzkých i běžných řezech",
      "rodiny": [
        {
          "rodina": "Archivo",
          "osy": [
            "wdth",
            "wght"
          ],
          "hodnoty": "62..125,400..600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "warning",
    "prototyp": "S09-Hreben.dc.html",
    "zdroj": "S09-Hreben",
    "interaktivni": false,
    "palety": [
      {
        "nazev": "Hory",
        "bg": "#FFFFFF",
        "surface": "#EEF3F8",
        "ink": "#12202E",
        "muted": "#4A5868",
        "line": "#D2DCE6",
        "primary": "#1C3A57",
        "onPrimary": "#FFFFFF",
        "link": "#1F4E7A",
        "accent": "#B3541A",
        "onAccent": "#FFFFFF",
        "deep": "#1C3A57",
        "onDeep": "#FFFFFF",
        "extra": {
          "far": "#2C5E8C",
          "near": "#3B6E9E",
          "snow": "#FFFFFF"
        }
      },
      {
        "nazev": "Sníh",
        "bg": "#FFFFFF",
        "surface": "#F2F5F7",
        "ink": "#101418",
        "muted": "#4D5560",
        "line": "#D9DEE3",
        "primary": "#0B6E8A",
        "onPrimary": "#FFFFFF",
        "link": "#0A6580",
        "accent": "#C7321F",
        "onAccent": "#FFFFFF",
        "deep": "#0E2A33",
        "onDeep": "#FFFFFF",
        "extra": {
          "far": "#155567",
          "near": "#1F7088",
          "snow": "#FFFFFF"
        }
      },
      {
        "nazev": "Smrk",
        "bg": "#FFFFFF",
        "surface": "#EEF4EF",
        "ink": "#122019",
        "muted": "#4A5C51",
        "line": "#CFDCD3",
        "primary": "#1F4A33",
        "onPrimary": "#FFFFFF",
        "link": "#1F4A33",
        "accent": "#D9A21B",
        "onAccent": "#122019",
        "deep": "#1F4A33",
        "onDeep": "#FFFFFF",
        "extra": {
          "far": "#2E6447",
          "near": "#3D7A58",
          "snow": "#F2F6F3"
        }
      }
    ]
  },
  {
    "klic": "rynek",
    "cislo": "10",
    "nazev": "Rynek",
    "podtitul": "Pro historická městečka a obce s náměstím.",
    "inspirace": "Administration varianta 2 – dvoubarevný titulek, koláž a karta s číslem",
    "pismo": {
      "googleFonts": "family=Vollkorn:wght@500;600&family=Hanken+Grotesk:wght@400;500;600",
      "family": "'Hanken Grotesk', system-ui, sans-serif",
      "popis": "Vollkorn (nadpisy) a Hanken Grotesk (text)",
      "rodiny": [
        {
          "rodina": "Vollkorn",
          "osy": [
            "wght"
          ],
          "hodnoty": "500;600"
        },
        {
          "rodina": "Hanken Grotesk",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "info",
    "prototyp": "S10-Rynek.dc.html",
    "zdroj": "S10-Rynek",
    "interaktivni": false,
    "palety": [
      {
        "nazev": "Náves",
        "bg": "#FFFFFF",
        "surface": "#EFE7DA",
        "ink": "#241A16",
        "muted": "#5F524C",
        "line": "#DCCFC0",
        "primary": "#8E3B2A",
        "onPrimary": "#FFFFFF",
        "link": "#8E3B2A",
        "accent": "#3E4A55",
        "onAccent": "#FFFFFF",
        "deep": "#3E4A55",
        "onDeep": "#FFFFFF",
        "extra": {
          "f1": "#C98F6B",
          "f2": "#3E4A55",
          "f3": "#B4553C",
          "f4": "#D9C3A0"
        }
      },
      {
        "nazev": "Gotika",
        "bg": "#FFFFFF",
        "surface": "#ECEEF2",
        "ink": "#171A21",
        "muted": "#4F5563",
        "line": "#D3D7DF",
        "primary": "#2E3A59",
        "onPrimary": "#FFFFFF",
        "link": "#2E3A59",
        "accent": "#B08D3C",
        "onAccent": "#171A21",
        "deep": "#171A21",
        "onDeep": "#FFFFFF",
        "extra": {
          "f1": "#8C97B0",
          "f2": "#2E3A59",
          "f3": "#5B6788",
          "f4": "#C9CEDA"
        }
      },
      {
        "nazev": "Pískovec",
        "bg": "#FFFFFF",
        "surface": "#F1EBDD",
        "ink": "#2A2418",
        "muted": "#5F5747",
        "line": "#DDD3BE",
        "primary": "#6F5A1E",
        "onPrimary": "#FFFFFF",
        "link": "#6A551B",
        "accent": "#3F6E6A",
        "onAccent": "#FFFFFF",
        "deep": "#2A2418",
        "onDeep": "#F1EBDD",
        "extra": {
          "f1": "#D8C08A",
          "f2": "#3F6E6A",
          "f3": "#A88A4A",
          "f4": "#E9DDBF"
        }
      }
    ]
  },
  {
    "klic": "radnice",
    "cislo": "11",
    "nazev": "Radnice",
    "podtitul": "Pro města od 2 000 do 10 000 obyvatel.",
    "inspirace": "Town Hall Municipal Portal (cmsmasters) – živý pruh zpráv a karty přes úvod",
    "pismo": {
      "googleFonts": "family=Schibsted+Grotesk:wght@400;500;600",
      "family": "'Schibsted Grotesk', system-ui, sans-serif",
      "popis": "Schibsted Grotesk (nadpisy i text)",
      "rodiny": [
        {
          "rodina": "Schibsted Grotesk",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "info",
    "prototyp": "S11-Radnice.dc.html",
    "zdroj": "S11-Radnice",
    "interaktivni": true,
    "palety": [
      {
        "nazev": "Modrá",
        "bg": "#FFFFFF",
        "surface": "#EAF1FA",
        "ink": "#14202E",
        "muted": "#4A5668",
        "line": "#DCE5F0",
        "primary": "#1D4F91",
        "onPrimary": "#FFFFFF",
        "link": "#1D4F91",
        "accent": "#F3C744",
        "onAccent": "#14202E",
        "deep": "#123462",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Zelená",
        "bg": "#FFFFFF",
        "surface": "#E8F3EC",
        "ink": "#102219",
        "muted": "#46594E",
        "line": "#CFE3D6",
        "primary": "#1B6B45",
        "onPrimary": "#FFFFFF",
        "link": "#1B6B45",
        "accent": "#F2B544",
        "onAccent": "#102219",
        "deep": "#0F3D27",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Večer",
        "bg": "#101826",
        "surface": "#182335",
        "ink": "#EEF2F8",
        "muted": "#A9B4C6",
        "line": "#2A3850",
        "primary": "#7FB2FF",
        "onPrimary": "#0B1220",
        "link": "#9CC3FF",
        "accent": "#F3C744",
        "onAccent": "#101826",
        "deep": "#0B1220",
        "onDeep": "#EEF2F8",
        "extra": {}
      }
    ]
  },
  {
    "klic": "kolonada",
    "cislo": "12",
    "nazev": "Kolonáda",
    "podtitul": "Pro lázeňská a kulturní místa.",
    "inspirace": "Town Hall City Mayor (cmsmasters) – dělený úvod s portrétem a čísla na pásu",
    "pismo": {
      "googleFonts": "family=Cormorant+Garamond:wght@500;600&family=Albert+Sans:wght@400;500;600",
      "family": "'Albert Sans', system-ui, sans-serif",
      "popis": "Cormorant Garamond (nadpisy) a Albert Sans (text)",
      "rodiny": [
        {
          "rodina": "Cormorant Garamond",
          "osy": [
            "wght"
          ],
          "hodnoty": "500;600"
        },
        {
          "rodina": "Albert Sans",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "off",
    "prototyp": "S12-Kolonada.dc.html",
    "zdroj": "S12-Kolonada",
    "interaktivni": false,
    "palety": [
      {
        "nazev": "Pramen",
        "bg": "#FFFFFF",
        "surface": "#DCEBE7",
        "ink": "#13231F",
        "muted": "#4A5D58",
        "line": "#C4D8D2",
        "primary": "#2E5E57",
        "onPrimary": "#FFFFFF",
        "link": "#2E5E57",
        "accent": "#8C6A22",
        "onAccent": "#FFFFFF",
        "deep": "#2E5E57",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Porcelán",
        "bg": "#FFFFFF",
        "surface": "#E8EEF7",
        "ink": "#141C2B",
        "muted": "#4B566A",
        "line": "#CDD7E6",
        "primary": "#2C4A7E",
        "onPrimary": "#FFFFFF",
        "link": "#2C4A7E",
        "accent": "#B5893B",
        "onAccent": "#141C2B",
        "deep": "#1C2F52",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Růže",
        "bg": "#FFFFFF",
        "surface": "#F6E9EC",
        "ink": "#2A161B",
        "muted": "#634C52",
        "line": "#E7D0D6",
        "primary": "#8A3B4F",
        "onPrimary": "#FFFFFF",
        "link": "#8A3B4F",
        "accent": "#5B6B48",
        "onAccent": "#FFFFFF",
        "deep": "#4A1F2B",
        "onDeep": "#FFFFFF",
        "extra": {}
      }
    ]
  },
  {
    "klic": "mlyn",
    "cislo": "13",
    "nazev": "Mlýn",
    "podtitul": "Pro průmyslové a pracovní obce.",
    "inspirace": "CityGov Downtown (Dannci) – úzký obří titulek a kruhové razítko",
    "pismo": {
      "googleFonts": "family=Barlow+Condensed:wght@500;600&family=Barlow:wght@400;500;600",
      "family": "'Barlow', system-ui, sans-serif",
      "popis": "Barlow Condensed (nadpisy a čísla) a Barlow (text)",
      "rodiny": [
        {
          "rodina": "Barlow Condensed",
          "osy": [
            "wght"
          ],
          "hodnoty": "500;600"
        },
        {
          "rodina": "Barlow",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "info",
    "prototyp": "S13-Mlyn.dc.html",
    "zdroj": "S13-Mlyn",
    "interaktivni": false,
    "palety": [
      {
        "nazev": "Pila",
        "bg": "#FFFFFF",
        "surface": "#F1F1EF",
        "ink": "#1E2124",
        "muted": "#50555B",
        "line": "#D7D7D3",
        "primary": "#C2461A",
        "onPrimary": "#FFFFFF",
        "link": "#B03F17",
        "accent": "#2F5D8A",
        "onAccent": "#FFFFFF",
        "deep": "#2B2F33",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Ocel",
        "bg": "#FFFFFF",
        "surface": "#EEF1F4",
        "ink": "#15191E",
        "muted": "#4C5560",
        "line": "#D4DAE1",
        "primary": "#0F5FA8",
        "onPrimary": "#FFFFFF",
        "link": "#0F5FA8",
        "accent": "#F2B705",
        "onAccent": "#15191E",
        "deep": "#15191E",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Dřevo",
        "bg": "#FFFFFF",
        "surface": "#F4EEE6",
        "ink": "#241B12",
        "muted": "#5D5144",
        "line": "#E0D4C4",
        "primary": "#7A4A1E",
        "onPrimary": "#FFFFFF",
        "link": "#7A4A1E",
        "accent": "#2F6B4F",
        "onAccent": "#FFFFFF",
        "deep": "#2B2017",
        "onDeep": "#F4EEE6",
        "extra": {}
      }
    ]
  },
  {
    "klic": "hraz",
    "cislo": "14",
    "nazev": "Hráz",
    "podtitul": "Pro obce u rybníků a přehrad.",
    "inspirace": "EGovt (ovatheme) – dlaždice služeb přes hranu úvodu a pás čísel",
    "pismo": {
      "googleFonts": "family=Commissioner:wght@400;500;600",
      "family": "'Commissioner', system-ui, sans-serif",
      "popis": "Commissioner (nadpisy i text)",
      "rodiny": [
        {
          "rodina": "Commissioner",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "warning",
    "prototyp": "S14-Hraz.dc.html",
    "zdroj": "S14-Hraz",
    "interaktivni": false,
    "palety": [
      {
        "nazev": "Rybník",
        "bg": "#FFFFFF",
        "surface": "#DDF0EE",
        "ink": "#0F2627",
        "muted": "#46605F",
        "line": "#C3E0DD",
        "primary": "#0E5E61",
        "onPrimary": "#FFFFFF",
        "link": "#0E5E61",
        "accent": "#D98A2B",
        "onAccent": "#0F2627",
        "deep": "#083D3F",
        "onDeep": "#FFFFFF",
        "extra": {
          "wave": "#13787C"
        }
      },
      {
        "nazev": "Rákos",
        "bg": "#FFFFFF",
        "surface": "#EEF0DF",
        "ink": "#1C2112",
        "muted": "#545B44",
        "line": "#D7DCBF",
        "primary": "#4D5E1C",
        "onPrimary": "#FFFFFF",
        "link": "#4D5E1C",
        "accent": "#C9792B",
        "onAccent": "#1C2112",
        "deep": "#2A3410",
        "onDeep": "#FFFFFF",
        "extra": {
          "wave": "#62762A"
        }
      },
      {
        "nazev": "Hladina",
        "bg": "#FFFFFF",
        "surface": "#E3EEF9",
        "ink": "#0D1B2C",
        "muted": "#475769",
        "line": "#C8DAED",
        "primary": "#1559A8",
        "onPrimary": "#FFFFFF",
        "link": "#1559A8",
        "accent": "#FF8A3D",
        "onAccent": "#0D1B2C",
        "deep": "#0B2E57",
        "onDeep": "#FFFFFF",
        "extra": {
          "wave": "#2370C4"
        }
      }
    ]
  },
  {
    "klic": "lupa",
    "cislo": "15",
    "nazev": "Lupa",
    "podtitul": "Pro obce se staršími obyvateli, důraz na přístupnost.",
    "inspirace": "gov.cz a GOV.UK – přístupnost na prvním místě",
    "pismo": {
      "googleFonts": "family=Atkinson+Hyperlegible+Next:wght@400;500;600",
      "family": "'Atkinson Hyperlegible Next', Verdana, sans-serif",
      "popis": "Atkinson Hyperlegible Next (nadpisy i text)",
      "rodiny": [
        {
          "rodina": "Atkinson Hyperlegible Next",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "20px",
    "radkovani": "1.5",
    "vychoziKrize": "info",
    "prototyp": "S15-Lupa.dc.html",
    "zdroj": "S15-Lupa",
    "interaktivni": true,
    "palety": [
      {
        "nazev": "Žlutá",
        "bg": "#FFFFFF",
        "surface": "#FFE14D",
        "ink": "#000000",
        "muted": "#333333",
        "line": "#000000",
        "primary": "#000000",
        "onPrimary": "#FFE14D",
        "link": "#0033CC",
        "accent": "#FFE14D",
        "onAccent": "#000000",
        "deep": "#000000",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Modrá",
        "bg": "#FFFFFF",
        "surface": "#DCEBFF",
        "ink": "#000000",
        "muted": "#333333",
        "line": "#000000",
        "primary": "#003A8C",
        "onPrimary": "#FFFFFF",
        "link": "#003A8C",
        "accent": "#DCEBFF",
        "onAccent": "#000000",
        "deep": "#00214F",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Tmavá",
        "bg": "#000000",
        "surface": "#1A1A1A",
        "ink": "#FFFFFF",
        "muted": "#D6D6D6",
        "line": "#FFFFFF",
        "primary": "#FFE14D",
        "onPrimary": "#000000",
        "link": "#FFE14D",
        "accent": "#FFE14D",
        "onAccent": "#000000",
        "deep": "#1A1A1A",
        "onDeep": "#FFFFFF",
        "extra": {}
      }
    ]
  },
  {
    "klic": "kompas",
    "cislo": "16",
    "nazev": "Kompas",
    "podtitul": "Pro obce, které chtějí hlavně mapu služeb.",
    "inspirace": "TownPress (LSVRthemes) – zajímavá místa, tady jako mapa služeb",
    "pismo": {
      "googleFonts": "family=Red+Hat+Display:wght@500;600&family=Red+Hat+Text:wght@400;500;600",
      "family": "'Red Hat Text', system-ui, sans-serif",
      "popis": "Red Hat Display (nadpisy) a Red Hat Text (text)",
      "rodiny": [
        {
          "rodina": "Red Hat Display",
          "osy": [
            "wght"
          ],
          "hodnoty": "500;600"
        },
        {
          "rodina": "Red Hat Text",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "info",
    "prototyp": "S16-Kompas.dc.html",
    "zdroj": "S16-Kompas",
    "interaktivni": true,
    "palety": [
      {
        "nazev": "Mapa",
        "bg": "#FFFFFF",
        "surface": "#F1F6F7",
        "ink": "#1A2A2E",
        "muted": "#4D5E63",
        "line": "#D5DEE0",
        "primary": "#0E5A6B",
        "onPrimary": "#FFFFFF",
        "link": "#0E5A6B",
        "accent": "#C2410C",
        "onAccent": "#FFFFFF",
        "deep": "#0E5A6B",
        "onDeep": "#FFFFFF",
        "extra": {
          "land": "#E3EBD9",
          "water": "#A9CCE3",
          "road": "#FFFFFF",
          "bld": "#CBD8C0",
          "pinRing": "#FFFFFF"
        }
      },
      {
        "nazev": "Turistická",
        "bg": "#FFFFFF",
        "surface": "#FFF7E0",
        "ink": "#1F1A0E",
        "muted": "#5C5440",
        "line": "#E8DDBA",
        "primary": "#B3261E",
        "onPrimary": "#FFFFFF",
        "link": "#A3221B",
        "accent": "#1D5FA8",
        "onAccent": "#FFFFFF",
        "deep": "#1F1A0E",
        "onDeep": "#FFF7E0",
        "extra": {
          "land": "#F2EBD3",
          "water": "#9FC6E4",
          "road": "#FFFFFF",
          "bld": "#E0D3AE",
          "pinRing": "#FFFFFF"
        }
      },
      {
        "nazev": "Noční",
        "bg": "#12181C",
        "surface": "#1A2227",
        "ink": "#EAF0F2",
        "muted": "#A6B3B8",
        "line": "#2C373D",
        "primary": "#5CC8D8",
        "onPrimary": "#0B1114",
        "link": "#7AD4E2",
        "accent": "#FF8F5C",
        "onAccent": "#12181C",
        "deep": "#0B1114",
        "onDeep": "#EAF0F2",
        "extra": {
          "land": "#1E2A25",
          "water": "#1E3A4F",
          "road": "#3A4A52",
          "bld": "#2A3A33",
          "pinRing": "#12181C"
        }
      }
    ]
  },
  {
    "klic": "magistrat",
    "cislo": "17",
    "nazev": "Magistrát",
    "podtitul": "Pro obce, které chtějí odpovídat i mimo úřední hodiny.",
    "inspirace": "Civica (AwaikenThemes) – tmavý úvod, místo hesla otázka pro asistenta",
    "pismo": {
      "googleFonts": "family=Onest:wght@400;500;600",
      "family": "'Onest', system-ui, sans-serif",
      "popis": "Onest (nadpisy i text)",
      "rodiny": [
        {
          "rodina": "Onest",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "emergency",
    "prototyp": "S17-Magistrat.dc.html",
    "zdroj": "S17-Magistrat",
    "interaktivni": true,
    "palety": [
      {
        "nazev": "Modrá",
        "bg": "#FFFFFF",
        "surface": "#DCE7F5",
        "ink": "#121A2B",
        "muted": "#4B5670",
        "line": "#CBD6E6",
        "primary": "#1F3A68",
        "onPrimary": "#FFFFFF",
        "link": "#1F3A68",
        "accent": "#2E7D46",
        "onAccent": "#FFFFFF",
        "deep": "#1F3A68",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Petrolej",
        "bg": "#FFFFFF",
        "surface": "#DDEFEF",
        "ink": "#0E2224",
        "muted": "#445F62",
        "line": "#C5E0E1",
        "primary": "#0D4F55",
        "onPrimary": "#FFFFFF",
        "link": "#0D4F55",
        "accent": "#B5462A",
        "onAccent": "#FFFFFF",
        "deep": "#0D4F55",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Lilek",
        "bg": "#FFFFFF",
        "surface": "#ECE6F6",
        "ink": "#1B1428",
        "muted": "#574D69",
        "line": "#D9D0EA",
        "primary": "#42286E",
        "onPrimary": "#FFFFFF",
        "link": "#42286E",
        "accent": "#1F7A5C",
        "onAccent": "#FFFFFF",
        "deep": "#42286E",
        "onDeep": "#FFFFFF",
        "extra": {}
      }
    ]
  },
  {
    "klic": "zpravodaj",
    "cislo": "18",
    "nazev": "Zpravodaj",
    "podtitul": "Pro obce, které hodně komunikují.",
    "inspirace": "TownPress (LSVRthemes) – zprávy a důležité formuláře, novinová hlavička",
    "pismo": {
      "googleFonts": "family=Newsreader:opsz,wght@6..72,400..600&family=Libre+Franklin:wght@400;500;600",
      "family": "'Libre Franklin', system-ui, sans-serif",
      "popis": "Newsreader (titulky) a Libre Franklin (text)",
      "rodiny": [
        {
          "rodina": "Newsreader",
          "osy": [
            "opsz",
            "wght"
          ],
          "hodnoty": "6..72,400..600"
        },
        {
          "rodina": "Libre Franklin",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "16px",
    "radkovani": "1.55",
    "vychoziKrize": "info",
    "prototyp": "S18-Zpravodaj.dc.html",
    "zdroj": "S18-Zpravodaj",
    "interaktivni": false,
    "palety": [
      {
        "nazev": "Novinová",
        "bg": "#FFFFFF",
        "surface": "#F1EEEC",
        "ink": "#17171A",
        "muted": "#5F5F66",
        "line": "#D9D6D3",
        "primary": "#A8231C",
        "onPrimary": "#FFFFFF",
        "link": "#17171A",
        "accent": "#A8231C",
        "onAccent": "#FFFFFF",
        "deep": "#17171A",
        "onDeep": "#FFFFFF",
        "extra": {
          "paper": "#F1EEEC",
          "river": "#9FB7C8"
        }
      },
      {
        "nazev": "Modrý tisk",
        "bg": "#FFFFFF",
        "surface": "#EDF0F5",
        "ink": "#121826",
        "muted": "#555D6E",
        "line": "#D5DAE3",
        "primary": "#1C4E9E",
        "onPrimary": "#FFFFFF",
        "link": "#121826",
        "accent": "#1C4E9E",
        "onAccent": "#FFFFFF",
        "deep": "#121826",
        "onDeep": "#FFFFFF",
        "extra": {
          "paper": "#EDF0F5",
          "river": "#A9C1E2"
        }
      },
      {
        "nazev": "Zelený tisk",
        "bg": "#FFFFFF",
        "surface": "#EAF1EC",
        "ink": "#13201A",
        "muted": "#52605A",
        "line": "#D3DED7",
        "primary": "#1F6B45",
        "onPrimary": "#FFFFFF",
        "link": "#13201A",
        "accent": "#1F6B45",
        "onAccent": "#FFFFFF",
        "deep": "#13201A",
        "onDeep": "#FFFFFF",
        "extra": {
          "paper": "#EAF1EC",
          "river": "#A8C9BA"
        }
      }
    ]
  },
  {
    "klic": "mikroregion",
    "cislo": "19",
    "nazev": "Mikroregion",
    "podtitul": "Pro svazky obcí a obce s více částmi.",
    "inspirace": "Town Hall (cmsmasters) – mřížka odborů, tady části obce s mapou",
    "pismo": {
      "googleFonts": "family=Familjen+Grotesk:wght@400;500;600",
      "family": "'Familjen Grotesk', system-ui, sans-serif",
      "popis": "Familjen Grotesk (nadpisy i text)",
      "rodiny": [
        {
          "rodina": "Familjen Grotesk",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "info",
    "prototyp": "S19-Mikroregion.dc.html",
    "zdroj": "S19-Mikroregion",
    "interaktivni": true,
    "palety": [
      {
        "nazev": "Olivová",
        "bg": "#F6F6EE",
        "surface": "#FFFFFF",
        "ink": "#1F2418",
        "muted": "#535A48",
        "line": "#DEDFD2",
        "primary": "#55652A",
        "onPrimary": "#FFFFFF",
        "link": "#4A5A21",
        "accent": "#E4E6D6",
        "onAccent": "#1F2418",
        "deep": "#55652A",
        "onDeep": "#FFFFFF",
        "extra": {
          "m1": "#C9D3A3",
          "m2": "#E2C98F",
          "m3": "#B7CDB9",
          "m4": "#D9B8A0"
        }
      },
      {
        "nazev": "Krajina",
        "bg": "#F4F7FA",
        "surface": "#FFFFFF",
        "ink": "#142030",
        "muted": "#4A5868",
        "line": "#D2DCE6",
        "primary": "#2C5E8C",
        "onPrimary": "#FFFFFF",
        "link": "#2C5E8C",
        "accent": "#DCE7F2",
        "onAccent": "#142030",
        "deep": "#2C5E8C",
        "onDeep": "#FFFFFF",
        "extra": {
          "m1": "#BFD6EA",
          "m2": "#CFE3C4",
          "m3": "#F0D9A8",
          "m4": "#D8C7E6"
        }
      },
      {
        "nazev": "Vřesoviště",
        "bg": "#F7F5F8",
        "surface": "#FFFFFF",
        "ink": "#20162A",
        "muted": "#5A4C63",
        "line": "#E2DAE6",
        "primary": "#6A3D7A",
        "onPrimary": "#FFFFFF",
        "link": "#6A3D7A",
        "accent": "#ECE4F0",
        "onAccent": "#20162A",
        "deep": "#6A3D7A",
        "onDeep": "#FFFFFF",
        "extra": {
          "m1": "#D9C3E2",
          "m2": "#C7D8C0",
          "m3": "#F1D7B5",
          "m4": "#BFD3E3"
        }
      }
    ]
  },
  {
    "klic": "urad",
    "cislo": "20",
    "nazev": "Úřad",
    "podtitul": "Pro obce, které chtějí vzhled podle gov.cz.",
    "inspirace": "Design systém gov.cz – hlavička, hledání, životní situace a deska",
    "pismo": {
      "googleFonts": "family=Roboto:wght@400;500;600",
      "family": "'Roboto', Arial, sans-serif",
      "popis": "Roboto (nadpisy i text, jako gov.cz)",
      "rodiny": [
        {
          "rodina": "Roboto",
          "osy": [
            "wght"
          ],
          "hodnoty": "400;500;600"
        }
      ]
    },
    "velikostTextu": "17px",
    "radkovani": "1.55",
    "vychoziKrize": "info",
    "prototyp": "S20-Urad.dc.html",
    "zdroj": "S20-Urad",
    "interaktivni": true,
    "palety": [
      {
        "nazev": "Státní modrá",
        "bg": "#FFFFFF",
        "surface": "#EBF1F8",
        "ink": "#1F2328",
        "muted": "#4E5864",
        "line": "#D5DEE8",
        "primary": "#2362A2",
        "onPrimary": "#FFFFFF",
        "link": "#2362A2",
        "accent": "#1D7A3A",
        "onAccent": "#FFFFFF",
        "deep": "#1A4A7C",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Krajská zelená",
        "bg": "#FFFFFF",
        "surface": "#E9F3EE",
        "ink": "#1A2420",
        "muted": "#4C5A54",
        "line": "#D1E2D9",
        "primary": "#17694A",
        "onPrimary": "#FFFFFF",
        "link": "#17694A",
        "accent": "#2362A2",
        "onAccent": "#FFFFFF",
        "deep": "#0E4A33",
        "onDeep": "#FFFFFF",
        "extra": {}
      },
      {
        "nazev": "Grafitová",
        "bg": "#FFFFFF",
        "surface": "#EEF0F2",
        "ink": "#1B1F24",
        "muted": "#4F5862",
        "line": "#D6DADF",
        "primary": "#3A4552",
        "onPrimary": "#FFFFFF",
        "link": "#2C5B8C",
        "accent": "#1D7A3A",
        "onAccent": "#FFFFFF",
        "deep": "#22282F",
        "onDeep": "#FFFFFF",
        "extra": {}
      }
    ]
  }
]

export const KONTROLY_KONTRASTU = [{"a": "ink", "b": "bg", "min": 7}, {"a": "ink", "b": "surface", "min": 7}, {"a": "muted", "b": "bg", "min": 4.5}, {"a": "muted", "b": "surface", "min": 4.5}, {"a": "link", "b": "bg", "min": 4.5}, {"a": "link", "b": "surface", "min": 4.5}, {"a": "onPrimary", "b": "primary", "min": 4.5}, {"a": "primary", "b": "bg", "min": 3}, {"a": "onAccent", "b": "accent", "min": 4.5}, {"a": "onDeep", "b": "deep", "min": 4.5}, {"a": "line", "b": "bg", "min": 1.15}] as const
