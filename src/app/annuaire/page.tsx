"use client";
import { useState, useMemo } from "react";
import PageHero from "@/components/PageHero";

const members = [
  { no: 1,  name: "Pr OUEDRAOGO Martial",          phone: "70 18 91 18",                    email: "patindaom@yahoo.fr",              institution: "CHU Yalgado OUEDRAOGO / OUAGADOUGOU" },
  { no: 2,  name: "Pr BADOUM Gisèle",               phone: "70 25 23 09",                    email: "gisebad@yahoo.fr",                institution: "CHU Yalgado OUEDRAOGO / OUAGADOUGOU" },
  { no: 3,  name: "Pr BONCOUNGOU Kadiatou",         phone: "70 75 97 92",                    email: "boncoungou_kadiatou@yahoo.fr",    institution: "CHU Yalgado OUEDRAOGO / OUAGADOUGOU" },
  { no: 4,  name: "Dr ZIGANI Adama",                phone: "70 26 58 64",                    email: "adazigani@gmail.com",             institution: "CNLAT  / OUAGADOUGOU " },
  { no: 5,  name: "Dr KI Celestine",                phone: "70 38 80 04",                    email: "celestoe@yahoo.fr",               institution: "SP-CNLS  / OUAGADOUGOU" },
  { no: 6,  name: "Dr BIRBA Emile",                 phone: "70 29 00 66",                    email: "birbaemile@yahoo.fr",             institution: "CHU Souro SANOU / BOBO-DIOULASSO" },
  { no: 7,  name: "Dr OUEDRAOGO Abdoul Risgou",     phone: "70 24 12 24",                    email: "oarisgou@yahoo.fr",               institution: "CHU Tengandogo / OUAGADOUGOU" },
  { no: 8,  name: "Dr KUIRE Marcel",                phone: "70 73 12 56",                    email: "mkuire@yahoo.fr",                 institution: "Hôpital District Boulmiougou / OUAGADOUGOU" },
  { no: 9,  name: "Dr BAYALA Rachel",               phone: "70 16 81 33",                    email: "nnrachel2006@yahoo.fr",           institution: "Office de Santé des Travailleurs  / OUAGADOUGOU" },
  { no: 10, name: "Dr MAIGA Soumaila",              phone: "70 86 64 70",                    email: "maigas01@yahoo.fr",               institution: "CHU Yalgado OUEDRAOGO / OUAGADOUGOU" },
  { no: 11, name: "Dr SOURABIE Adama",              phone: "70 36 51 53",                    email: "adamasourabie@yahoo.fr",          institution: "CHU de Pala / BOBO-DIOULASSO" },
  { no: 12, name: "Dr OUEDRAOGO Guy",               phone: "70 23 41 32",                    email: "guyhorse@hotmail.com",            institution: "CHU Régional de Ouahigouya / OUAHIGOUYA" },
  { no: 13, name: "Dr OUEDRAOGO Patricia",          phone: "70 17 71 47",                    email: "patricia_roseline@yahoo.fr",      institution: "CHR de Kaya / KAYA" },
  { no: 14, name: "Dr KOUMBEM Bourèma",             phone: "70 99 71 82 / 78 21 10 19",      email: "bkoumbem@yahoo.fr",               institution: "CHUP Charles de Gaulle / OUAGADOUGOU" },
  { no: 15, name: "Dr DAMOUE Sandrine Nadège",      phone: "71 22 20 01",                    email: "damouesandrine@yahoo.fr",         institution: "CHU de Bogodogo / OUAGADOUGOU" },
  { no: 16, name: "Dr KOALGA Richard",              phone: "78 71 05 07",                    email: "totaxe@yahoo.fr",                 institution: "CHR de Tenkodogo / TENKODOGO" },
  { no: 17, name: "Dr ZIDA Dominique",              phone: "78 24 74 89 / 73 98 63 68",      email: "zida.dominique@yahoo.fr",         institution: "CHU de Bogodogo / OUAGADOUGOU" },
  { no: 18, name: "Dr SOME Wilfried",               phone: "70 05 01 61",                    email: "yiordowilfied@yahoo.fr",          institution: "Office de Santé des Travailleurs  /BOBO-DIOULASSO" },
  { no: 19, name: "Dr OUEDRAOGO Julienne",          phone: "78 05 29 94",                    email: "julyoued@gmail.com",              institution: "CHU Tengandogo / OUAGADOUGOU" },
  { no: 20, name: "Dr BOUGMA Ghislain",             phone: "70 64 23 62",                    email: "bougmaghisso@yahoo.fr",           institution: "CHU Yalgado OUEDRAOGO / OUAGADOUGOU" },
  { no: 21, name: "Dr MINOUNGOU Jules Christian",   phone: "70 07 13 20",                    email: "ouagamjcw@yahoo.fr",              institution: "CHU Tengandogo / OUAGADOUGOU" },
  { no: 22, name: "Dr LANKOANDE Siri Hermann",      phone: "70 15 30 75",                    email: "lank1siri@yahoo.fr",              institution: "Hôpital Militaire Capitaine Halassane COULIBALY / OUAGADOUGOU" },
  { no: 23, name: "Dr KUNAKEY K. Edem (en stage en France)",             phone: "73 33 97 19",                    email: "tkunakey@yahoo.fr",               institution: "CHR de Fada N'Gourma / FADA N'GOURMA" },
  { no: 24, name: "Dr COULIBALY Aly",               phone: "70 74 99 31 / 76 58 01 03",      email: "acoulibaly649@yahoo.fr",          institution: "CHR de Koudougou / KOUDOUGOU" },
  { no: 25, name: "Dr YAOGHO Idrissa",              phone: "73 96 36 99 / 79 77 25 44",      email: "idrissayaogho@yahoo.fr",          institution: "CHU Régional de Ouahigouya / OUAHIGOUYA" },
  { no: 26, name: "Dr ZAGRE Laurent (en stage en France) ",               phone: "71 64 37 20 / 76 69 79 03",      email: "zagrelaurent@yahoo.fr",           institution: "CHR de Ziniaré  / ZINIARÉ" },
  { no: 27, name: "Dr OUEDRAOGO Armel P.",          phone: "70 52 17 60 / 78 69 47 78",      email: "armelo_2005@yahoo.fr",            institution: "CHU de Bogodogo / OUAGADOUGOU" },
  { no: 28, name: "Dr MAÏGA Moumouni",              phone: "70 31 58 05 / 76 09 92 50",      email: "maigamouni@yahoo.fr",             institution: "CHR de Gaoua / GAOUA" },
  { no: 29, name: "Dr LOABA Abdou Eric",            phone: "70 59 11 34 / 64 55 11 91",      email: "koulieza@yahoo.fr",               institution: "CHR de Dédougou / DÉDOUGOU" },
  { no: 30, name: "Dr NIKIEMA R. M. Tanguy",        phone: "71 19 25 37",                    email: "tanguynikiema@outlook.com",       institution: "CHR de Manga / MANGA" },
  { no: 31, name: "Dr PARE Salif",                  phone: "70 99 78 44 / 76 69 95 60",      email: "salifpare@yahoo.fr",              institution: "CHR de Fada N'Gourma / FADA N'GOURMA" },
  { no: 32, name: "Dr SENI Hanyezouma Eléonore",   phone: "70 65 01 06",                    email: "sheleonora2@gmail.com",           institution: "CHR de Ziniaré  / ZINIARÉ" },
  { no: 33, name: "Dr TIEMTORE Barthélemy",         phone: "70 14 16 19 / 66 14 16 18",      email: "barthelvisdelor@yahoo.fr",        institution: "CHR de Tenkodogo / TENKODOGO" },
  { no: 34, name: "Dr DELMA Eric",                  phone: "70 09 45 00",                    email: "dr.ericdelma@gmail.com",          institution: "CHR de Gaoua / GAOUA" },
  { no: 35, name: "Dr SOUBEIGA Dimitri",            phone: "71 31 75 51",                    email: "soubeigadimitri@yahoo.fr",        institution: "CHR de Banfora / BANFORA" },
  { no: 36, name: "Dr DEMBELE Ousmane",             phone: "76 92 31 07",                    email: "maneouss1@gmail.com",             institution: "CHU de Pala / BOBO-DIOULASSO" },
  { no: 37, name: "Dr ZONGO Marthe",                phone: "72 33 05 54",                    email: "zongomarth@yahoo.fr",             institution: "CHR de Kaya / KAYA" },
  { no: 38, name: "Dr OUEDRAGOGO Abdramane ",  phone: "54 41 42 22 / 61 49 30 49",      email: "abdramanevier@gmail.com",              institution: "__" },
  { no: 39, name: "Dr NONGKOUNI Gilbert",           phone: "72 02 80 29",                    email: "gilbertnongkouni@gmail.com",      institution: "CHR de Manga / MANGA" },
  { no: 40, name: "Dr VALIA Aboulaye",              phone: "76 79 08 07",                    email: "valiaaboulaye@gmail.com",                                institution: "CHUP Charles de Gaulle / OUAGADOUGOU" },
  { no: 41, name: "Dr TRAORE Yann Idriss",   phone: "63 85 97 52",                    email: "sydriss2355@gmail.com",                                institution: "Hôpital Militaire Capitaine Halassane COULIBALY / OUAGADOUGOU" },
];

const lieux = ["Tous", ...Array.from(new Set(members.map((m) => m.institution.replace(/ \(En stage\)| \(IDH\)/g, "").trim()))).sort()];

export default function AnnuairePage() {
  const [search, setSearch] = useState("");
  const [lieu, setLieu] = useState("Tous");

  const filtered = useMemo(() => members.filter((m) => {
    const matchSearch = search === "" || m.name.toLowerCase().includes(search.toLowerCase());
    const matchLieu = lieu === "Tous" || m.institution.toLowerCase().includes(lieu.toLowerCase());
    return matchSearch && matchLieu;
  }), [search, lieu]);

  return (
    <>
      <PageHero
        title="Annuaire des pneumologues"
        subtitle="Liste officielle des membres pneumologues de la SOBUP — 41 spécialistes à travers le Burkina Faso."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Annuaire" }]}
        tag="Répertoire national"
        shape="wave"
      />

      {/* Filtres */}
      <section className="bg-background border-b border-gray-100 py-4 sticky top-[70px] z-40">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            {lieux.map((l) => <option key={l}>{l}</option>)}
          </select>
          {(search || lieu !== "Tous") && (
            <button
              onClick={() => { setSearch(""); setLieu("Tous"); }}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            {filtered.length} pneumologue{filtered.length > 1 ? "s" : ""} {lieu !== "Tous" ? `à ${lieu}` : "membres"}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold">Aucun résultat pour cette recherche.</p>
            </div>
          ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m) => (
              <div key={m.no} className="bg-white rounded-2xl p-5 border border-gray-100 card-shadow hover:shadow-lg hover:-translate-y-0.5 transition-all">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                    style={{ background: "#31B9AE" }}>
                    {m.no}
                  </div>
                  <h3 className="font-black text-gray-900 text-sm leading-tight">{m.name}</h3>
                </div>
                {/* Infos */}
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                    <span>{m.institution}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span>{m.phone}</span>
                  </div>
                  {m.email ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <a href={`mailto:${m.email}`} className="text-primary hover:underline break-all">{m.email}</a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 opacity-30">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <span>—</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>
    </>
  );
}
