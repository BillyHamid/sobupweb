"use client";

import PageHero from "@/components/PageHero";
import { useState, useMemo } from "react";

type Member = {
  id: number;
  nom: string;
  qualif: string;
  lieu: string;
  tel: string;
  email: string;
};

const members: Member[] = [
  { id: 1, nom: "Pr OUEDRAOGO Martial", qualif: "Pneumologue", lieu: "PPH CHUYO", tel: "70 18 91 18", email: "patindaom@yahoo.fr" },
  { id: 2, nom: "Pr BADOUM Gisèle", qualif: "Pneumologue", lieu: "PPH CHUYO", tel: "70 25 23 09", email: "gisebad@yahoo.fr" },
  { id: 3, nom: "Pr BONCOUNGOU Kadiatou", qualif: "Pneumologue", lieu: "PPH CHUYO", tel: "70 75 97 92", email: "boncoungou_kadiatou@yahoo.fr" },
  { id: 4, nom: "Dr ZIGANI Adama", qualif: "Pneumologue", lieu: "CNLAT", tel: "70 26 58 64", email: "adazigani@gmail.com" },
  { id: 5, nom: "Dr KI Celestine", qualif: "Pneumologue", lieu: "SP/CNLS Schiphra", tel: "70 38 80 04", email: "celestoe@yahoo.fr" },
  { id: 6, nom: "Dr BIRBA Emile", qualif: "Pneumologue", lieu: "PPH CHUSS Bobo", tel: "70 29 00 66", email: "birbaemile@yahoo.fr" },
  { id: 7, nom: "Dr OUEDRAOGO Abdoul Risgou", qualif: "Pneumologue", lieu: "CHU Tengandogo", tel: "70 24 12 24", email: "oarisgou@yahoo.fr" },
  { id: 8, nom: "Dr TIENDREBEOGO Arnaud", qualif: "Physiologiste", lieu: "PPH CHUYO", tel: "70 13 73 17", email: "flarjean@yahoo.fr" },
  { id: 9, nom: "Dr SONDO/OUEDRAOGO Appoline", qualif: "Infectiologue", lieu: "CHUYO", tel: "70 07 71 98", email: "sondoapoline@yahoo.fr" },
  { id: 10, nom: "Dr BAZONGO Moussa", qualif: "Chirurgien thoracique", lieu: "CHU Tengandogo", tel: "70 63 02 93", email: "baz_moussa@yahoo.fr" },
  { id: 11, nom: "Dr OUOBA Richard", qualif: "Pharmacien", lieu: "Pharmacie Louis Pasteur", tel: "70 23 17 83", email: "plp@fasonet.bf" },
  { id: 12, nom: "Dr KABORE Mikaïla", qualif: "Infectiologue", lieu: "CHU Pala", tel: "70 71 20 15", email: "mikailakab@gmail.com" },
  { id: 13, nom: "Dr KUIRE Marcel", qualif: "Pneumologue", lieu: "Hôpital District Boulmiougou", tel: "70 73 12 56", email: "mkuire@yahoo.fr" },
  { id: 14, nom: "Dr BAYALA Rachel", qualif: "Pneumologue", lieu: "OST", tel: "70 16 81 33", email: "nnrachel2006@yahoo.fr" },
  { id: 15, nom: "Dr MAIGA Soumaila", qualif: "Pneumologue", lieu: "PPH CHUYO", tel: "70 86 64 70", email: "maigas01@yahoo.fr" },
  { id: 16, nom: "Dr SOURABIE Adama", qualif: "Pneumologue", lieu: "PPH CHUSS Bobo", tel: "70 36 51 53", email: "adamasourabie@yahoo.fr" },
  { id: 17, nom: "Dr OUEDRAOGO Guy", qualif: "Pneumologue", lieu: "CHUR Ouahigouya", tel: "70 23 41 32", email: "guyhorse@hotmail.com" },
  { id: 18, nom: "Dr OUEDRAOGO Patricia", qualif: "Pneumologue", lieu: "Kaya", tel: "70 17 71 47", email: "patricia_roseline@yahoo.fr" },
  { id: 19, nom: "Dr KOUMBEM Bourèma", qualif: "Pneumologue", lieu: "CHUP-CDG", tel: "70 99 71 82 / 78 21 10 19", email: "bkoumbem@yahoo.fr" },
  { id: 20, nom: "Dr DAMOUE Sandrine Nadège", qualif: "Pneumologue", lieu: "CHU-Bogodogo", tel: "71 22 20 01", email: "damouesandrine@yahoo.fr" },
  { id: 21, nom: "Dr KOALGA Richard", qualif: "Pneumologue", lieu: "CHR Tenkodogo", tel: "78 71 05 07", email: "totaxe@yahoo.fr" },
  { id: 22, nom: "Dr ZIDA Dominique", qualif: "Pneumologue", lieu: "CHU-Bogodogo", tel: "78 24 74 89 / 73 98 63 68", email: "zida.dominique@yahoo.fr" },
  { id: 23, nom: "Dr SOME Wilfried", qualif: "Pneumologue", lieu: "OST/Bobo", tel: "70 05 01 61", email: "yiordowilfied@yahoo.fr" },
  { id: 24, nom: "Dr OUEDRAOGO Julienne", qualif: "Pneumologue", lieu: "CHU Tengandogo", tel: "78 05 29 94", email: "julyoued@gmail.com" },
  { id: 25, nom: "Dr BOUGMA Ghislain", qualif: "Pneumologue", lieu: "PPH CHUYO", tel: "70 64 23 62", email: "bougmaghisso@yahoo.fr" },
  { id: 26, nom: "Dr MINOUNGOU Jules Christian", qualif: "Pneumologue", lieu: "CHU Tengandogo", tel: "70 07 13 20", email: "ouagamjcw@yahoo.fr" },
  { id: 27, nom: "Dr LANKOANDE Siri Hermann", qualif: "Pneumologue", lieu: "Camp de l'Unité", tel: "70 15 30 75", email: "lank1siri@yahoo.fr" },
  { id: 28, nom: "Dr KUNAKEY K. Edem", qualif: "Pneumologue", lieu: "CHR Fada N'gourma (En stage)", tel: "73 33 97 19", email: "tkunakey@yahoo.fr" },
  { id: 29, nom: "Dr COULIBALY Aly", qualif: "Pneumologue", lieu: "CHR Koudougou", tel: "70 74 99 31 / 76 58 01 03", email: "acoulibaly649@yahoo.fr" },
  { id: 30, nom: "Dr YAOGHO Idrissa", qualif: "Pneumologue", lieu: "CHUR Ouahigouya", tel: "73 96 36 99 / 79 77 25 44", email: "idrissayaogho@yahoo.fr" },
  { id: 31, nom: "Dr ZAGRE Laurent", qualif: "Pneumologue", lieu: "CHR Ziniaré (En stage)", tel: "71 64 37 20 / 76 69 79 03", email: "zagrelaurent@yahoo.fr" },
  { id: 32, nom: "Dr OUEDRAOGO Armel P.", qualif: "Pneumologue", lieu: "CHU-Bogodogo", tel: "70 52 17 60 / 78 69 47 78", email: "armelo_2005@yahoo.fr" },
  { id: 33, nom: "Dr MAÏGA Moumouni", qualif: "Pneumologue", lieu: "CHR Gaoua", tel: "70 31 58 05 / 76 09 92 50", email: "maigamouni@yahoo.fr" },
  { id: 34, nom: "Dr LOABA Abdou Eric", qualif: "Pneumologue", lieu: "CHR Dédougou", tel: "70 59 11 34 / 64 55 11 91", email: "koulieza@yahoo.fr" },
  { id: 35, nom: "Dr NIKIEMA R. M. Tanguy", qualif: "Pneumologue", lieu: "CHR Manga (En stage)", tel: "71 19 25 37", email: "tanguynikiema@outlook.com" },
  { id: 36, nom: "Dr PARE Salif", qualif: "Pneumologue", lieu: "CHR Fada N'Gourma", tel: "70 99 78 44 / 76 69 95 60", email: "salifpare@yahoo.fr" },
  { id: 37, nom: "Dr SENI Hanyezouma Eléonore", qualif: "Pneumologue", lieu: "CHR Ziniaré", tel: "70 65 01 06", email: "sheleonora2@gmail.com" },
  { id: 38, nom: "Dr TIEMTORE Barthélemy", qualif: "Pneumologue", lieu: "CHR Tenkodogo", tel: "70 14 16 19 / 66 14 16 18", email: "barthelvisdelor@yahoo.fr" },
  { id: 39, nom: "Dr DELMA Eric", qualif: "Pneumologue", lieu: "CHR Gaoua", tel: "70 09 45 00", email: "dr.ericdelma@gmail.com" },
  { id: 40, nom: "Dr SOUBEIGA Dimitri", qualif: "Pneumologue", lieu: "CHR Banfora", tel: "71 31 75 51", email: "soubeigadimitri@yahoo.fr" },
  { id: 41, nom: "Dr DEMBELE Ousmane", qualif: "Pneumologue", lieu: "CHU SS Bobo", tel: "76 92 31 07", email: "maneouss1@gmail.com" },
  { id: 42, nom: "Dr ZONGO Marthe", qualif: "Pneumologue", lieu: "CHR Kaya", tel: "72 33 05 54", email: "zongomarth@yahoo.fr" },
  { id: 43, nom: "Dr OUEDRAGOGO Abdramane", qualif: "Pneumologue", lieu: "En attente d'affectation", tel: "54 41 42 22 / 61 49 30 49", email: "abdramanevier@gmail.com" },
  { id: 44, nom: "Dr NONGKOUNI Gilbert", qualif: "Pneumologue", lieu: "CHR Manga", tel: "72 02 80 29", email: "nongkouni@gmail.com" },
  { id: 45, nom: "Dr VALIA Aboulaye", qualif: "Pneumologue", lieu: "CHUP-CDG", tel: "76 79 08 07", email: "valiaaboulaye@gmail.com" },
  { id: 46, nom: "Dr TRAORE Yann Idriss", qualif: "Pneumologue", lieu: "Camp de l'Unité", tel: "63 85 97 52", email: "yanntraore2355@gmail.com" },
  { id: 47, nom: "Dr MOUSSA Rahana", qualif: "Pneumologue", lieu: "Niger", tel: "+227 88 48 10 60", email: "rahanamoussa1981@gmail.com" },
  { id: 48, nom: "Dr BOPAKA Régis G.", qualif: "Pneumologue", lieu: "Congo", tel: "79 01 09 03 / 65 37 55 67", email: "bopaka2@gmail.com" },
  { id: 49, nom: "Dr HALIDOU MOUSSA Souleymane", qualif: "Pneumologue", lieu: "Niger", tel: "+227 96 59 27 44", email: "hmsouley@yahoo.fr" },
  { id: 50, nom: "Dr ATTAHER Sala", qualif: "Pneumologue", lieu: "Niger", tel: "+227 96 26 44 08", email: "salaattaher@gmail.com" },
  { id: 51, nom: "Dr BEMBA Esthel Lee Presley", qualif: "Pneumologue", lieu: "Congo", tel: "", email: "bemba1@gmx.fr" },
  { id: 52, nom: "ADAMBOUNOU Tété A Sthéphane", qualif: "Pneumologue", lieu: "Lomé", tel: "75 26 06 61 / 60 45 18 57", email: "amentos@yahoo.fr" },
  { id: 53, nom: "Dr MBELE ONANA Charles Lebon", qualif: "Pneumologue", lieu: "Cameroun", tel: "+237 97 84 28 96", email: "cmbeleonana@yahoo.com" },
  { id: 54, nom: "Dr ESSAGA/BANIEM Eloundou Christèle", qualif: "Pneumologue", lieu: "Cameroun", tel: "+237 6 51 02 97 60", email: "chrisbaniem@gmail.com" },
  { id: 55, nom: "Dr ALLAMDOU DJOH Narcisse", qualif: "Pneumologue", lieu: "Tchad", tel: "+235 95 59 97 60", email: "narcisse.allamdoudjoh@gmail.com" },
  { id: 56, nom: "Dr ABAFEGA Fabrice Tatiana", qualif: "Pneumologue", lieu: "USA", tel: "+1 (667) 371-9907", email: "abafegatatiana@gmail.com" },
  { id: 57, nom: "Dr PAMBHET Christian", qualif: "Pneumologue", lieu: "France", tel: "65 38 10 54", email: "p_christiariane2002@yahoo.fr" },
  { id: 58, nom: "Dr NGUE Clémence", qualif: "Pneumologue", lieu: "Cameroun", tel: "", email: "teclerngue@gmail.com" },
  { id: 59, nom: "Dr TAGNE MEKOWA Laurence Larissa", qualif: "Pneumologue", lieu: "Ouagadougou", tel: "64 16 99 21", email: "laurence.tagne@gmail.com" },
  { id: 60, nom: "Dr BONSA Edmond", qualif: "DES Pneumo", lieu: "CHUYO", tel: "74 34 85 70", email: "bonsaedmon20111993@gmail.com" },
  { id: 61, nom: "Dr SAWADOGO Alain Gautier", qualif: "DES Pneumo", lieu: "CHUYO", tel: "76 54 35 04", email: "sawadogoalaingautier@gmail.com" },
  { id: 62, nom: "Dr OUEDRAOGO/SANA Aminata", qualif: "DES Pneumo", lieu: "CHUYO", tel: "65 31 58 51", email: "chaniparfaite@gmail.com" },
  { id: 63, nom: "Dr OUEDRAOGO/BADO Bertille Sophie Y", qualif: "DES Pneumo", lieu: "CHUYO", tel: "63 08 49 05", email: "yiboulabado@gmail.com" },
  { id: 64, nom: "Dr OUEDRAOGO Wendmi E Marie Leithisia", qualif: "DES Pneumo", lieu: "CHUYO", tel: "70 44 42 53", email: "laericia7@gmail.com" },
  { id: 65, nom: "Dr AKIRIDZO Iod Vidélina", qualif: "DES Pneumo", lieu: "CHUYO", tel: "+242 069404938", email: "iakiridzo@gmail.com" },
  { id: 66, nom: "Dr BADOLO/OUEDRAOGO Aissatou", qualif: "DES Pneumo", lieu: "CHUYO", tel: "55 34 80 89", email: "ouedraogoaissatou@gmail.com" },
  { id: 67, nom: "Dr BASSIA Aoua Kalilizatou", qualif: "DES Pneumo", lieu: "CHUYO", tel: "71 22 00 93", email: "aouabassia33@gmail.com" },
  { id: 68, nom: "Dr COULIDIATY/BOURGOU B. P. Larissa", qualif: "DES Pneumo", lieu: "CHUYO", tel: "71 08 03 50", email: "laripris@gmail.com" },
  { id: 69, nom: "Dr ILBOUDO François", qualif: "DES Pneumo", lieu: "CHUYO", tel: "76 87 98 84", email: "Ilbfranco1991@gmail.com" },
  { id: 70, nom: "Dr KABORE/OUEDRAOGO Fatimata", qualif: "DES Pneumo", lieu: "CHUYO", tel: "70 38 16 56", email: "ouedfatimata85@gmail.com" },
  { id: 71, nom: "Dr ZOUNDI Lydia Rosine", qualif: "DES Pneumo", lieu: "CHUYO", tel: "72 10 14 34", email: "zoundilydiarosine@gmail.com" },
  { id: 72, nom: "Dr ZANRE/SEGUEDA Arzouma Evelyne", qualif: "DES Pneumo", lieu: "CHUYO", tel: "71 99 43 51", email: "a.evelynesegueda@gmail.com" },
  { id: 73, nom: "Dr TAPSOBA Roland Arnaud", qualif: "DES Pneumo", lieu: "CHUYO", tel: "62 40 36 98", email: "arnotapso@gmail.com" },
  { id: 74, nom: "Dr ZOUNGRANA/DIABATE Madina", qualif: "DES Pneumo", lieu: "CHUYO", tel: "70 69 68 37", email: "madinadiabate25@gmail.com" },
  { id: 75, nom: "Dr NADIR HAROU Garba (IDH)", qualif: "DES Pneumo", lieu: "CHUYO", tel: "57 23 28 12", email: "nadirharou704@gmail.com" },
  { id: 76, nom: "Dr KANAO Rokya", qualif: "DES Pneumo", lieu: "CHUYO", tel: "76 99 78 53", email: "kanaorokya33@gmail.com" },
  { id: 77, nom: "Dr YAO N P Nouria", qualif: "DES Pneumo", lieu: "CHUYO", tel: "66 44 71 50", email: "yao.npn@gmail.com" },
  { id: 78, nom: "Dr OUEDRAOOGO P. Carine", qualif: "DES Pneumo", lieu: "CHUYO", tel: "70 02 65 06", email: "ouedcarine89@gmail.com" },
  { id: 79, nom: "Dr ILBOUDO A. W. Serge", qualif: "DES Pneumo", lieu: "CHUYO", tel: "76 44 53 87", email: "sergeilboudo89@gmail.com" },
  { id: 80, nom: "Dr BOUBACAR S. Marzouk", qualif: "DES Pneumo", lieu: "CHUYO", tel: "55 43 17 58", email: "marzouk.boub@gmail.com" },
  { id: 81, nom: "Dr ZAKANE Muniirah", qualif: "DES Pneumo", lieu: "CHUYO", tel: "78 34 34 78", email: "muniirahzakane91@gmail.com" },
  { id: 82, nom: "Dr ALI MOUSSA M. Laouali", qualif: "DES Pneumo", lieu: "CHUYO", tel: "+227 97 99 42 69", email: "laoualiali32@gmail.com" },
  { id: 83, nom: "Dr COULIBALY Pié Mamadou", qualif: "DES Pneumo", lieu: "CHUYO", tel: "72 81 27 49", email: "piemamadou@yahoo.com" },
  { id: 84, nom: "Dr KIMA Pascaline", qualif: "DES Pneumo", lieu: "CHUYO", tel: "66 78 79 45", email: "pascalinekima66@gmail.com" },
  { id: 85, nom: "Dr OUEDRAOGO Sakina Yasmine", qualif: "DES Pneumo", lieu: "CHUYO", tel: "76 39 85 39", email: "doctayas@gmail.com" },
  { id: 86, nom: "Dr NABA Wibè", qualif: "DES Pneumo", lieu: "CHUYO", tel: "76 94 51 15", email: "huilenaba@gmail.com" },
  { id: 87, nom: "Dr KANKIONO Cheleyi Nadine", qualif: "DES Pneumo", lieu: "CHUYO", tel: "70 94 77 44", email: "kanticheleyidina@gmail.com" },
  { id: 88, nom: "Dr TINDANO Bienvenue Y. Carole", qualif: "DES Pneumo", lieu: "CHUP-CDG", tel: "60 89 07 20", email: "y.bienvenue98@gmail.com" },
  { id: 89, nom: "Dr OUEDRAOGO Anna Wendyam", qualif: "DES Pneumo", lieu: "CHUYO", tel: "71 87 74 96", email: "annawendyam5@gmail.com" },
  { id: 90, nom: "DALA Charles Rodrigue Lawko", qualif: "DES Pneumo", lieu: "CHUP-CDG", tel: "75 54 00 17", email: "dala88425@gmail.com" },
  { id: 91, nom: "KAMOUBA K. Malibabeni", qualif: "DES Pneumo", lieu: "CHUYO", tel: "66 65 16 73", email: "kamoubathomas@gmail.com" },
  { id: 92, nom: "OUOBA Yentéma Maximilien", qualif: "DES Pneumo", lieu: "CHUYO", tel: "61 59 74 94 / 55 72 33 60", email: "maximilien02ouoba@gmail.com" },
  { id: 93, nom: "Dr KOANDA Abdoul Rahim", qualif: "DES Pneumo", lieu: "CHR Koudougou", tel: "64 53 41 4", email: "koandaar2031@gmail.com" },
  { id: 94, nom: "Dr KABORE Michel", qualif: "DES Pneumo", lieu: "CHUP-CDG", tel: "70 66 93 86", email: "kabmick90@gmail.com" },
  { id: 95, nom: "Dr TIEMOUNOU Boureima", qualif: "DES Pneumo", lieu: "CHUP-CDG", tel: "65 52 30 60", email: "boureimtiemounou@gmail.com" },
  { id: 96, nom: "SOULAMA Adama", qualif: "DES Pneumo", lieu: "CHUYO", tel: "75 32 19 15", email: "adamasoulama067@gmail.com" },
  { id: 97, nom: "Dr DIALLO Abdoul Aziz", qualif: "DES Pneumo", lieu: "CHU-Tengandogo", tel: "60 77 08 00", email: "abdoulazizdiallo337@gmail.com" },
  { id: 98, nom: "Dr OUEDRAOGO Olivia", qualif: "DES Pneumo", lieu: "CHU-Tengandogo", tel: "73 01 96 19", email: "oliviaouedraogo@gmail.com" },
  { id: 99, nom: "SANFO Amssa", qualif: "DES Pneumo", lieu: "CHU-Tengandogo", tel: "71 03 60 99", email: "amssasanfo94@gmail.com" },
  { id: 100, nom: "TANKOANO Sita", qualif: "DES Pneumo", lieu: "CHUR Ouahigouya", tel: "57 83 87 01", email: "tankoanosita@gmail.com" },
  { id: 101, nom: "COMPAORE F. Betsaleel Gilles", qualif: "DES Pneumo", lieu: "CHUYO", tel: "72 85 19 02", email: "betsa.comp@gmail.com" },
  { id: 102, nom: "SAWADOGO Mohamado", qualif: "DES Pneumo", lieu: "CHUYO", tel: "63 03 71 28", email: "sawadogomohamed327@gmail.com" },
  { id: 103, nom: "BAMOGO Souleymane", qualif: "DES Pneumo", lieu: "CHUYO", tel: "57 60 80 66", email: "bamogosouleymane07@gmail.com" },
  { id: 104, nom: "Dr DJEGOÏ Judith", qualif: "DES Pneumo", lieu: "CHUYO", tel: "77 70 52 91", email: "judithdjegoi91@gmail.com" },
  { id: 105, nom: "TRAORE Kevin Wilfried", qualif: "DES Pneumo", lieu: "CHUYO", tel: "61 07 12 28", email: "kevintraore83@gmail.com" },
  { id: 106, nom: "OUATTARA Cédric Idriss", qualif: "DES Pneumo", lieu: "CHU Bogodogo", tel: "61 31 51 60", email: "cedricouattara3@gmail.com" },
  { id: 107, nom: "OUEDRAOGO Nafissatou", qualif: "DES Pneumo", lieu: "CHUYO", tel: "6 130 07 97", email: "nafissatou844@gmail.com" },
  { id: 108, nom: "BAMOUNI Chelcy Géraldine", qualif: "DES Pneumo", lieu: "CHUYO", tel: "70 56 74 12", email: "geraldinebamouni31@gmail.com" },
  { id: 109, nom: "Dr NIKIEMA Josiane Flora", qualif: "DES Pneumo", lieu: "CHUYO", tel: "62 11 18 24", email: "josiechounike5@gmail.com" },
  { id: 110, nom: "TINTA Faosia", qualif: "DES Pneumo", lieu: "CHUYO", tel: "73 39 84 18", email: "faosia.tinta99@gmail.com" },
  { id: 111, nom: "BAMBARA T. Hubert Brice", qualif: "DES Pneumo", lieu: "CHU Tengandogo", tel: "67 66 08 43", email: "bricebambara9@gmail.com" },
  { id: 112, nom: "KABORE Prince W. Stéphane", qualif: "DES Pneumo", lieu: "CHU Tengandogo", tel: "66 44 03 11", email: "kprincesteph11@gmail.com" },
  { id: 113, nom: "OUEDRAOGO Josué W. (1er jumeau)", qualif: "DES Pneumo", lieu: "CHUP-CDG", tel: "62 49 39 51", email: "oshoued@gmail.com" },
  { id: 114, nom: "TAPSOBA Sammuel", qualif: "DES Pneumo", lieu: "CHR Koudougou", tel: "61 61 10 51", email: "sammutapsoba@gmail.com" },
  { id: 115, nom: "DRABO Kadidia", qualif: "DES Pneumo", lieu: "CHR Koudougou", tel: "73 44 27 36", email: "kadidiadrabo73@gmail.com" },
  { id: 116, nom: "SORI Sanata Malika", qualif: "DES Pneumo", lieu: "CHR Koudougou", tel: "61 74 08 67", email: "sorimalika66@gmail.com" },
  { id: 117, nom: "TOUGMA Mathias W.", qualif: "DES Pneumo", lieu: "CHR Koudougou", tel: "77 92 44 68", email: "tougmamathiaswendepouy@gmail.com" },
  { id: 118, nom: "YAO Sanlé Nicolas", qualif: "DES Pneumo", lieu: "CHUSS", tel: "67 88 62 61", email: "yaosanlenicolas@gmail.com" },
  { id: 119, nom: "DAO Kadjatou Koubra", qualif: "DES Pneumo", lieu: "CHUSS", tel: "77 48 33 10", email: "kadjatoukoubradao@gmail.com" },
  { id: 120, nom: "BA Abdoul Fatah", qualif: "DES Pneumo", lieu: "CHU Pala", tel: "74 46 76 60", email: "babdoulfatah@gmail.com" },
  { id: 121, nom: "KONATE Descia Josiane", qualif: "DES Pneumo", lieu: "CHU Pala", tel: "61 67 59 41", email: "desciakonat@gmail.com" },
  { id: 122, nom: "ZONGO Francisca Lucianne", qualif: "DES Pneumo", lieu: "CHU Pala", tel: "62 53 26 54", email: "ciscazongo@gmail.com" },
  { id: 123, nom: "SAWADOGO Nomwendé Esther", qualif: "DES Pneumo", lieu: "CHU Pala", tel: "73 93 40 99", email: "esthersawadogo102@gmail.com" },
  { id: 124, nom: "NIKIEMA Zacharia", qualif: "DES Pneumo", lieu: "CHUR Ouahigouya", tel: "70 35 62 19", email: "nikiemazakaria3@gmail.com" },
  { id: 125, nom: "Dr TOMPOUDI Isaac Wilfried", qualif: "DES Pneumo", lieu: "CHUR Ouahigouya", tel: "72 87 86 80", email: "isaacwilfriedtompoudi@gmail.com" },
  { id: 126, nom: "SAWADOGO Abdouch Abraham", qualif: "DES Pneumo", lieu: "CHUR Ouahigouya", tel: "73 37 37 97", email: "abdoucharbilsawadogo@gmail.com" },
  { id: 127, nom: "Dr FOFANA Zaliha", qualif: "DES Pneumo", lieu: "CHUR Ouahigouya", tel: "78 92 23 08", email: "zalhiafofana@gmail.com" },
];

const qualifOrder = ["Pneumologue", "DES Pneumo", "Physiologiste", "Infectiologue", "Chirurgien thoracique", "Pharmacien"];

const qualifStyle: Record<string, { bg: string; color: string }> = {
  "Pneumologue":           { bg: "#E8F9F7", color: "#0a7265" },
  "DES Pneumo":            { bg: "#EFF6FF", color: "#1D4ED8" },
  "Physiologiste":         { bg: "#F5F3FF", color: "#6D28D9" },
  "Infectiologue":         { bg: "#FFF7ED", color: "#C2410C" },
  "Chirurgien thoracique": { bg: "#FEF2F2", color: "#B91C1C" },
  "Pharmacien":            { bg: "#F0FDF4", color: "#15803D" },
};

const filterChips = ["Toutes", "Pneumologue", "DES Pneumo", "Autres spécialités"];

const isOther = (q: string) => !["Pneumologue", "DES Pneumo"].includes(q);

const cleanTel = (t: string) => t.replace(/[\s./]/g, "").split(",")[0];

export default function MembresPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Toutes");

  const counts = useMemo(() => ({
    total: members.length,
    pneumo: members.filter((m) => m.qualif === "Pneumologue").length,
    des: members.filter((m) => m.qualif === "DES Pneumo").length,
    autres: members.filter((m) => isOther(m.qualif)).length,
  }), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      const matchSearch =
        !q ||
        m.nom.toLowerCase().includes(q) ||
        m.lieu.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.tel.toLowerCase().includes(q);
      const matchFilter =
        filter === "Toutes" ||
        (filter === "Autres spécialités" ? isOther(m.qualif) : m.qualif === filter);
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const grouped = useMemo(
    () =>
      qualifOrder
        .map((q) => ({ q, items: filtered.filter((m) => m.qualif === q) }))
        .filter((g) => g.items.length > 0),
    [filtered]
  );

  return (
    <>
      <PageHero
        title="Liste des membres de la SOBUP"
        subtitle="Annuaire officiel des membres de la Société Burkinabè de Pneumologie — pneumologues, DES de pneumologie et spécialités associées."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Annuaire", href: "/annuaire" },
          { label: "Membres" },
        ]}
        tag={`${counts.total} membres inscrits`}
        shape="diagonal-right"
      />

      {/* Stats */}
      <section className="bg-background py-8 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: counts.total, label: "Membres au total" },
            { value: counts.pneumo, label: "Pneumologues" },
            { value: counts.des, label: "DES de Pneumo" },
            { value: counts.autres, label: "Autres spécialités" },
          ].map((s) => (
            <div key={s.label} className="text-center p-5 rounded-2xl" style={{ background: "#f0fafa" }}>
              <p className="text-3xl font-black mb-1" style={{ color: "#31B9AE" }}>{s.value}</p>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recherche + filtres */}
      <section className="bg-background border-b border-gray-100 sticky top-[70px] z-40">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1 min-w-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un nom, un hôpital, un email…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ "--tw-ring-color": "#31B9AE" } as React.CSSProperties}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {filterChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setFilter(chip)}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors"
                style={
                  filter === chip
                    ? { background: "#31B9AE", color: "white", borderColor: "#31B9AE" }
                    : { color: "#64748b", borderColor: "#e2e8f0" }
                }
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Liste */}
      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4">
          {grouped.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-2xl border border-gray-100">
              <p className="text-4xl mb-3">🔎</p>
              <p className="text-gray-600 font-semibold">Aucun membre ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {grouped.map((group) => {
                const s = qualifStyle[group.q] ?? { bg: "#f1f5f9", color: "#475569" };
                return (
                  <div key={group.q}>
                    <div className="flex items-center gap-3 mb-5">
                      <h2 className="text-xl font-black text-gray-900">{group.q}</h2>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {group.items.length}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.items.map((m) => (
                        <article
                          key={m.id}
                          className="bg-background rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all card-shadow flex flex-col"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
                              style={{ background: s.bg, color: s.color }}
                            >
                              {m.id}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-black text-gray-900 text-sm leading-tight">{m.nom}</h3>
                              <span
                                className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                                style={{ background: s.bg, color: s.color }}
                              >
                                {m.qualif}
                              </span>
                            </div>
                          </div>
                          <div className="mt-1 mb-3 flex items-start gap-1.5 text-xs text-gray-600">
                            <span>📍</span>
                            <span className="leading-snug">{m.lieu}</span>
                          </div>
                          <div className="mt-auto space-y-1.5 pt-3 border-t border-gray-100">
                            {m.tel && (
                              <a
                                href={`tel:${cleanTel(m.tel)}`}
                                className="flex items-center gap-2 text-xs text-gray-600 hover:text-primary transition-colors break-all"
                              >
                                <span className="shrink-0">📞</span> <span>{m.tel}</span>
                              </a>
                            )}
                            {m.email && (
                              <a
                                href={`mailto:${m.email}`}
                                className="flex items-center gap-2 text-xs text-gray-600 hover:text-primary transition-colors break-all"
                              >
                                <span className="shrink-0">✉️</span> <span className="truncate">{m.email}</span>
                              </a>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
