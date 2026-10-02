/* Sadler Family Archive — data model.
   Sources woven together here:
     doc    = Family document (2026) — Daniel & Elizabeth origins, the twelve, Jonah's line
     master = MacFamilyTree master database (built 2013–16, 141 people)
     rtf    = Oral-history notes (Sadler Data.rtf)
     conf   = Family confirmations from review sessions (2026)
   Nothing is silently corrected: variant-name merges and conflicts are flagged
   in each person's expandable notes and in the Data review page.
   To add a photo: save it as photos/<id>.jpg (see photos/PHOTO-GUIDE.txt). */

const SRC = {
  doc:'Family document (2026)',
  master:'Master database (MacFamilyTree, 2013–16)',
  rtf:'Oral-history notes (Sadler Data.rtf)',
  conf:'Family confirmation (review sessions, 2026)',
};

const BRANCH = {
  sadler:   {name:'Sadler line',            hex:'#2F5238'},
  bullarkie:{name:'Bullarkie line',         hex:'#C98A12'},
  malcolm:  {name:'Malcolm line',           hex:'#46688C'},
  bigby:    {name:'Bigby family',           hex:'#8C5A46'},
  patterson:{name:'Patterson family',       hex:'#7A4E7E'},
  gordon:   {name:'Gordon–Richards network',hex:'#1F6E63'},
  bucknor:  {name:'Bucknor family',         hex:'#A3492A'},
  aiken:    {name:'Aiken family',           hex:'#8A8A33'},
  other:    {name:'Married into the family',hex:'#77776B'},
};

const FRAG_NAMES = {
  trunk:'Main trunk', aiken:'Aiken fragment', brissit:'Gordon–Richards network',
  bucknorf:'Bucknor family fragment', scotsman:'Scotsman Gordon fragment', unplaced:'Not yet placed',
};

const P = {};
function person(o){ P[o.id]=Object.assign({parents:[],spouses:[],children:[],nicknames:[],places:[],roles:[],srcs:['master'],extra:[],flags:[]},o); }
function link(parents, childIds){ childIds.forEach(c=>{ P[c].parents=parents.slice(); parents.forEach(p=>P[p].children.push(c)); }); }
function marry(a,b){ P[a].spouses.push(b); P[b].spouses.push(a); }

const RTF_NOTE='From the oral-history notes (Sadler Data.rtf), gathered in conversation with an older family member; exact interview date and location not preserved. Unconfirmed against documents.';

/* ============ MAIN TRUNK — origins ============ */
person({id:'malcolm-gf', name:'Malcolm (senior)', branch:'malcolm', srcs:['doc'],
  desc:'A landowner from Scotland; grandfather of Elizabeth.', places:['Scotland'],
  notes:'Recorded only as a landowner from Scotland — the father of Elizabeth\u2019s father. His first name is not yet in the record.'});
person({id:'bull-father', name:'Bullarkie (Daniel\u2019s father)', branch:'bullarkie', srcs:['doc'],
  desc:'Came from Rajasthan, India in 1846 as an indentured servant; bookkeeper on the Kew Estates, Hanover.',
  places:['Rajasthan, India','Kew Estates, Hanover, Jamaica'], roles:['Bookkeeper (indentured), Kew Estates'],
  notes:'He worked as a bookkeeper on the Kew Estates in Hanover, owned by the Sadler family — which is where the surname Sadler came from. His first name is not yet recorded.'});
person({id:'bull-mother', name:'Bullarkie (Daniel\u2019s mother)', branch:'bullarkie', srcs:['doc'],
  desc:'Came from Rajasthan, India in 1846.', places:['Rajasthan, India','Hanover, Jamaica'],
  notes:'The family document says Daniel was born \u201Cto Indian parents who came from Rajasthan, India in 1846.\u201D Her name is not yet recorded.'});
person({id:'malcolm-father', name:'Malcolm (Elizabeth\u2019s father)', branch:'malcolm', srcs:['doc'],
  desc:'An overseer who lived in Hopewell, Hanover; son of a Scottish landowner.',
  places:['Hopewell, Hanover'], roles:['Overseer'],
  notes:'Described in the family document as a \u201Chalf-caste\u201D overseer living in Hopewell, Hanover, whose father was a landowner from Scotland. The Malcolms owned the land where Knockalva now sits, including the great house — later donated to the government, and in turn to the school. Elizabeth was the last of his 11 children.'});
person({id:'eliz-mother', name:'Elizabeth\u2019s mother', branch:'malcolm', srcs:['doc'],
  desc:'An African woman held in slavery on the Sadler estate.', places:['Hanover, Jamaica'],
  notes:'The family document states plainly that Elizabeth\u2019s mother was an African woman enslaved to Mr. Sadler. Her name is not yet recorded — a gap the family may one day be able to close.'});

person({id:'daniel', name:'Daniel Sadler', nicknames:['Pupa'], branch:'sadler', srcs:['doc','master'],
  maiden:'n\u00E9 Bullarkie', birth:{year:1878, place:'Jamaica'}, death:{year:1953},
  desc:'Land surveyor, philosopher, astrologer and teacher. Owned 12 acres at Jericho.',
  places:['Jamaica','Jericho, Hanover'], roles:['Land surveyor, Public Works','Philosopher','Astrologer','Teacher'],
  notes:'Daniel worked as a land surveyor for Public Works — including on the Sadler family\u2019s own land. He passed the 3rd Jamaica Local Exam and owned 12 acres of land in Jericho at his death in 1953. He had many siblings; his sister Anne lived close to him.',
  flags:['The document says he died \u201Cin his sixties\u201D, but 1878\u20131953 makes him 74\u201375 — see Data review.']});
person({id:'anne', name:'Anne (Christiana) Bullarkie', branch:'bullarkie', srcs:['doc'], marriedName:'married Meggoe',
  desc:'Daniel\u2019s sister, who lived close to him.',
  notes:'Christiana Bullarkie, called Anne, married a Meggoe. Of Daniel\u2019s many siblings, she is the one remembered as living nearby.'});
person({id:'elizabeth', name:'Elizabeth Sadler', nicknames:['Muma','Queenie','Mother Dan'], branch:'sadler', srcs:['doc','master'],
  maiden:'n\u00E9e Malcolm', birth:{year:1879, place:'Castle Heights, Hanover'},
  death:{year:1976, date:'23 August 1976', detail:'aged 97'}, marriage:{date:'9 August 1903', to:'daniel'},
  desc:'The last of 11 children on her father\u2019s side; the family matriarch.',
  places:['Castle Heights, Hanover'],
  notes:'Elizabeth — Muma, Queenie, Mother Dan — married Daniel on 9 August 1903 and lived to 97, passing on 23 August 1976.',
  flags:['The document gives her age at marriage as 22, though her birth year suggests 24 — see Data review.']});

/* ============ MAIN TRUNK — children of Daniel & Elizabeth ============
   The two sources name this generation differently. Where the names are
   clearly the same person they are merged with the variant recorded; where a
   match is only likely, it is flagged. Winnie and Lester appear only in the
   family document; Hortence and Herbert only in the oral-history notes. */
person({id:'lilian', name:'Lilian Sadler', branch:'sadler', srcs:['master','doc','conf'],
  variant:'written as \u201CLilieth (Lilly)\u201D in the family document — confirmed: Lilian is correct',
  desc:'Married Reginol Patterson; mother of the Patterson children.',
  extra:['Family confirmation (August 2026): Lilian is the correct name, not the family document\u2019s \u201CLilieth\u201D. \u201CLilly\u201D may still have been used informally.']});
person({id:'berte', name:'Berte Sadler', branch:'sadler', srcs:['master'],
  desc:'Married Mary Sadler; a daughter and granddaughter are recorded but not yet named.',
  flags:['Possibly the same person as Herbert \u201CBertie\u201D Sadler — kept separate until confirmed, see Data review.']});
person({id:'hilda', name:'Hilda Sadler', branch:'sadler', srcs:['master','doc','rtf'],
  desc:'Mother of Claire, Palty, Nanny and Karl.'});
person({id:'erskine', name:'Erskine Sadler', branch:'sadler', srcs:['master','doc','rtf'],
  desc:'Father of three daughters whose names are not yet recorded.'});
person({id:'jonah', name:'Jonah Oliver Sadler', nicknames:['Mass Jonah'], branch:'sadler', srcs:['master','doc'],
  birth:{year:1908, date:'1 October 1908', place:'Brownsville'},
  death:{year:1981, date:'14 November 1981', detail:'aged 73'},
  marriage:{date:'17 February 1944', to:'gertrude'},
  desc:'Father of ten recorded children; the best-documented branch of this generation.',
  notes:'Mass Jonah was born in Brownsville on 1 October 1908 and married Gertrude Bucknor on 17 February 1944. He died on 14 November 1981, aged 73.'});
person({id:'hesra', name:'Hesra Sadler', branch:'sadler', srcs:['master','doc','conf'],
  variant:'written as \u201CEzra\u201D in the family document — confirmed the same person',
  desc:'Parent of Hueburt, Ruel and Glen.',
  extra:['Family confirmation (August 2026): Hesra is the correct name; the family document\u2019s \u201CEzra\u201D is the same person.']});
person({id:'herga', name:'Herga Sadler', branch:'sadler', srcs:['master','doc'],
  birth:{year:1904, date:'11 December 1904'}, marriage:{to:'lbigby'},
  desc:'Married Lester Bigby; mother of eight.'});
person({id:'michael', name:'Michael Sadler', branch:'sadler', srcs:['master','doc','conf'],
  variant:'written as \u201CMicah\u201D in the family document — confirmed the same person',
  birth:{year:1903, date:'21 June 1903', place:'Jericho, Hanover'},
  desc:'Brother of Enid, Hortence and Herbert.',
  extra:['Family confirmation (August 2026): Michael is the correct name; the family document\u2019s \u201CMicah\u201D is the same person. His 21 June 1903 birth date comes from that document.']});
person({id:'enid', name:'Enid Sadler', branch:'sadler', srcs:['master','rtf','conf'],
  desc:'Sister of Michael Sadler; daughter of Daniel and Elizabeth.',
  notes:'The master database originally recorded Enid as Michael\u2019s daughter; the oral history describes her as his sister. The family confirmed in review: Enid is Michael\u2019s sister — a child of Daniel and Elizabeth.',
  extra:['Resolved conflict: repositioned from Michael\u2019s daughter (master database) to his sister, per family confirmation.']});
person({id:'harboury', name:'Harboury Sadler', branch:'sadler', srcs:['master','doc','conf'],
  variant:'written as \u201CArbrey\u201D in the family document — confirmed the same person',
  desc:'Parent of Kingsley, Kay and Herman.',
  extra:['Family confirmation (August 2026): Harboury is the correct name; the family document\u2019s \u201CArbrey\u201D is the same person.']});
person({id:'monte', name:'Montaque Sadler', nicknames:['Monte'], branch:'sadler', srcs:['master','doc','rtf','conf'],
  birth:{year:1924},
  desc:'Associated with Bath, St Thomas Parish, per the oral history.',
  extra:['Family confirmation (August 2026): Montaque is the proper name and \u201CMonte\u201D is believed to be his nickname — the master database listed him as Monte, the family document as \u201CMonty\u201D.']});
person({id:'hortence', name:'Hortence Sadler', branch:'sadler', srcs:['rtf'],
  desc:'Listed in the oral history alongside Michael and Enid as a sibling.', extra:[RTF_NOTE]});
person({id:'herbert', name:'Herbert Sadler', nicknames:['Bertie'], branch:'sadler', srcs:['rtf','doc'],
  desc:'Listed in the oral history alongside Michael and Enid as a sibling; called \u201CBertie\u201D in the family document.',
  extra:[RTF_NOTE],
  flags:['Possibly the same person as Berte Sadler (who married Mary) — kept separate until confirmed, see Data review.']});
person({id:'winnie', name:'Winnie Sadler', branch:'sadler', srcs:['doc'],
  desc:'Listed among the children in the family document only.',
  flags:['Appears only in the family document, not in the master database — see Data review.']});
person({id:'lester', name:'Lester Sadler', branch:'sadler', srcs:['doc'],
  birth:{year:1906, date:'July 1906'}, death:{year:1924, approx:true, detail:'died at 18 years'},
  desc:'Died at just 18 years old.',
  flags:['Appears only in the family document. Death year estimated from his 1906 birth.']});

/* spouses of that generation */
person({id:'reginol', name:'Reginol Patterson', branch:'patterson', srcs:['rtf'],
  desc:'Married Lilian Sadler.', extra:[RTF_NOTE]});
person({id:'mary', name:'Mary Sadler', branch:'other', srcs:['master'], desc:'Married Berte Sadler.'});
person({id:'gertrude', name:'Gertrude Sadler', maiden:'n\u00E9e Bucknor', branch:'bucknor', srcs:['master','doc'],
  marriage:{date:'17 February 1944', to:'jonah'},
  desc:'Married Jonah Oliver Sadler in 1944; mother of most of his children.',
  notes:'Gertrude Bucknor married Mass Jonah on 17 February 1944. Which of Jonah\u2019s ten recorded children are hers is partly unresolved — Trevor and Clifford had other mothers, and the family is checking the rest.',
  flags:['Her connection to the Glen & Wilfrid Bucknor family (recorded separately) is not yet established — see Data review.']});
person({id:'lbigby', name:'Lester Bigby', branch:'bigby', srcs:['doc'], desc:'Married Herga Sadler; father of their eight children.'});

/* ============ Lilian's children (Patterson) ============ */
person({id:'avis', name:'Avis Sadler', branch:'patterson', srcs:['rtf'],
  desc:'Daughter of Lilian and Reginol; keeps the Sadler surname in the notes.',
  extra:['Retains the Sadler surname in the oral-history notes rather than Patterson. '+RTF_NOTE]});
person({id:'lauris', name:'Lauris Patterson', branch:'patterson', srcs:['rtf'], extra:[RTF_NOTE]});
person({id:'epsi', name:'Epsi Patterson', branch:'patterson', srcs:['rtf'], extra:[RTF_NOTE]});
person({id:'gracep', name:'Grace Patterson', branch:'patterson', srcs:['rtf'], extra:[RTF_NOTE]});
person({id:'elaine', name:'Elaine Patterson', branch:'patterson', srcs:['rtf'],
  desc:'Placement uncertain — sibling of Avis, Lauris, Epsi and Grace, or a niece.',
  flags:['Set apart from her likely siblings in the original notes; the generation is unclear. Shown here as a sibling until confirmed — see Data review.'],
  extra:[RTF_NOTE]});

/* ============ Berte's line ============ */
person({id:'berte-d', name:'Unnamed Sadler', branch:'sadler', srcs:['rtf'],
  desc:'Daughter of Berte Sadler; name not yet recorded.', extra:[RTF_NOTE]});
person({id:'berte-gd', name:'Unnamed', branch:'sadler', srcs:['rtf'],
  desc:'Daughter of Berte\u2019s daughter — Berte\u2019s granddaughter. Name not yet recorded.', extra:[RTF_NOTE]});

/* ============ Hilda's children ============ */
person({id:'claire', name:'Claire Sadler', branch:'sadler', srcs:['rtf'], extra:[RTF_NOTE]});
person({id:'palty', name:'Palty Sadler', branch:'sadler', srcs:['rtf'], extra:[RTF_NOTE],
  flags:['\u201CPalty\u201D may be a nickname rather than a legal given name.']});
person({id:'nanny', name:'Nanny Sadler', branch:'sadler', srcs:['rtf'], extra:[RTF_NOTE],
  flags:['\u201CNanny\u201D is possibly a nickname rather than a legal given name.']});
person({id:'karl', name:'Karl Sadler', branch:'sadler', srcs:['rtf'], extra:[RTF_NOTE]});

/* ============ Erskine's daughters ============ */
person({id:'erskd1', name:'Unnamed Sadler', branch:'sadler', srcs:['rtf'],
  desc:'Daughter #1 of Erskine Sadler; name unknown (placeholder recorded by family contact \u201CJua\u201D).', extra:[RTF_NOTE]});
person({id:'erskd2', name:'Unnamed Sadler', branch:'sadler', srcs:['rtf'],
  desc:'Daughter #2 of Erskine Sadler; name unknown.', extra:[RTF_NOTE]});
person({id:'erskd3', name:'Unnamed Sadler', branch:'sadler', srcs:['rtf'],
  desc:'Daughter #3 of Erskine Sadler; name unknown.', extra:[RTF_NOTE]});

/* ============ Jonah's children (merged from both sources) ============ */
person({id:'louis', name:'Louis Sadler', branch:'sadler', srcs:['master','doc'],
  variant:'recorded as \u201COswald Louis Sadler\u201D in the family document',
  birth:{year:1940, date:'6 January 1940'},
  desc:'Married Christine, then Marie; father of Noita.'});
person({id:'trevor', name:'Trevor Sadler', branch:'sadler', srcs:['master','doc','rtf'],
  birth:{year:1947, date:'17 June 1947'}, death:{year:2023, date:'7 December 2023'},
  motherNote:'Unknown — the family is unsure who his mother was; confirmed not Gertrude (family note, August 2026).',
  desc:'Son of Jonah; father of a daughter working in medicine in Miami.',
  notes:'Trevor died on 7 December 2023, the most recent passing in the family record. His daughter, not yet named here, works in medicine in Miami, Florida — described as \u201Chigh profile\u201D in the oral history.',
  extra:['Family note (August 2026): Trevor\u2019s mother was not Gertrude. Earlier in the same review it was said Trevor and Clifford had different mothers from each other; the family is now unsure who either mother was. Both points stay open in Data review.']});
person({id:'unnamed155', name:'Unnamed Sadler', branch:'sadler', srcs:['master'],
  desc:'A child of Jonah recorded in the master database without a name.'});
person({id:'owen', name:'Owen Sadler', branch:'sadler', srcs:['master','doc'],
  variant:'recorded as \u201COwen Jehoe Sadler\u201D in the family document',
  birth:{year:1944, date:'4 August 1944'},
  desc:'Married Beverley Richards — the doorway to the Gordon\u2013Richards network.'});
person({id:'romel', name:'Romel Sadler', branch:'sadler', srcs:['master','doc'],
  variant:'recorded as \u201CRomel Augustus Sadler\u201D in the family document',
  birth:{year:1948, date:'26 February 1948'},
  desc:'Father of Steve, Debbie, Simone, Norris and Gary.'});
person({id:'clifford', name:'Clifford Sadler', branch:'sadler', srcs:['master','doc','conf'],
  birth:{year:1941}, death:{year:2009},
  motherNote:'Unknown — the family is unsure who his mother was; confirmed not Gertrude (family note, August 2026).',
  desc:'Son of Jonah; married Hazel; father of Mark and Michelle.',
  notes:'Clifford (1941\u20132009) married Hazel. Their son Mark was born 18 June 1973 and daughter Michelle at North Middlesex Hospital, London — one of the family\u2019s diaspora branches.',
  extra:['The master database held two Clifford Sadler records; the family confirmed in review they are one person — Jonah\u2019s son, married to Hazel, father of Mark and Michelle.',
         'Family note (August 2026): Clifford\u2019s mother was not Gertrude. The family is unsure who she was — see Data review.']});
person({id:'annie', name:'Annie Sadler', branch:'sadler', srcs:['master'],
  desc:'A daughter of Jonah recorded in the master database.'});
person({id:'wynter', name:'Unnamed Wynter', branch:'other', srcs:['conf'],
  desc:'Partner of Carmen Sadler; surname Wynter, given name not yet recorded — the father of Trudi and Chadwick Wynter.',
  extra:['Added per family confirmation (August 2026): Carmen\u2019s partner, surname Wynter. Given name not yet recorded; the surname matches their children Trudi and Chadwick Wynter.']});
person({id:'carmen', name:'Carmen Sadler', branch:'sadler', srcs:['master','doc'],
  variant:'recorded as \u201CCarmen Isadore Sadler\u201D in the family document',
  birth:{year:1951, date:'18 July 1951'},
  desc:'Parent of Trudi and Chadwick Wynter.'});
person({id:'canute', name:'Canute Sadler', branch:'sadler', srcs:['master','doc'],
  variant:'recorded as \u201CCanute Harold Sadler\u201D in the family document',
  birth:{year:1941, date:'10 July 1941'},
  desc:'Married Michelle; father of five.'});
person({id:'kingsley', name:'Kingsley Sadler', branch:'sadler', srcs:['master','doc','conf'],
  variant:'recorded as \u201CKingsley George Sadler\u201D in the family document',
  birth:{year:1942, date:'4 September 1942'},
  desc:'Married Leila; father of Lauren, Kurt and Kyle.',
  extra:['The master database held two Kingsley Sadler records; the family confirmed in review they are one person — Jonah\u2019s son, married to Leila.',
         'Family confirmation (August 2026): born 1942 (4 September 1942, per the family document), settling the master database\u2019s 1943 date.']});

/* Jonah-generation spouses */
person({id:'christine', name:'Christine Sadler', branch:'other', srcs:['master'], desc:'First recorded wife of Louis Sadler.'});
person({id:'marie-l', name:'Marie', branch:'other', srcs:['master'], desc:'Second recorded wife of Louis Sadler; mother of Noita.'});
person({id:'hazel', name:'Hazel Sadler', branch:'other', srcs:['master'], desc:'Married Clifford Sadler; mother of Mark and Michelle.'});
person({id:'michelle-c', name:'Michelle Sadler', branch:'other', srcs:['master'], desc:'Married Canute Sadler.'});
person({id:'leila', name:'Leila Sadler', branch:'other', srcs:['master'], desc:'Married Kingsley Sadler.'});
person({id:'beverley', name:'Beverley Sadler', maiden:'n\u00E9e Richards', branch:'gordon', srcs:['master'], childGhost:true,
  desc:'Daughter of Cleopatra Gordon; married Owen Sadler — the link between the main trunk and the Gordon\u2013Richards network.',
  notes:'Beverley Richards married Owen Sadler, which is how the whole Gordon, Richards, Brissit and connected families enter this tree. She appears twice on the tree — once beside Owen, once (dashed) under her mother Cleopatra — but is one person.'});

/* ============ Grandchildren via Jonah ============ */
person({id:'noita', name:'Noita Sadler', branch:'sadler', srcs:['master'], desc:'Daughter of Louis and Marie.'});
person({id:'april', name:'April Sadler', branch:'sadler', srcs:['conf'],
  birth:{year:2009, approx:true, place:'United Kingdom'}, places:['United Kingdom'],
  desc:'Daughter of Louis (Oswald) Sadler; born in the UK.',
  extra:['Added per family confirmation (August 2026): a daughter of Louis Oswald Sadler, aged 17 and born in the UK; not present in the July 2026 export. Birth year (\u2248 2009) is derived from her stated age and marked approximate.']});
person({id:'trevor-d', name:'Moesha Sadler', branch:'sadler', srcs:['rtf','conf'],
  desc:'Daughter of Trevor; works in medicine in Miami, Florida — \u201Chigh profile\u201D per the oral history.',
  places:['Miami, Florida, USA'],
  extra:['Name confirmed by the family (August 2026) as Moesha \u2014 the daughter recorded in the oral history as working in medicine in Miami.', RTF_NOTE]});
person({id:'trevor-s', name:'Unnamed Sadler', branch:'sadler', srcs:['conf'],
  desc:'Son of Trevor Sadler; name not yet recorded.',
  extra:['Added per family confirmation (August 2026): Trevor also had a son. Name not yet recorded.']});
person({id:'sophia', name:'Sophia Sadler', branch:'sadler', srcs:['master'], desc:'Daughter of Owen and Beverley; married Rupert Morling.'});
person({id:'stephen', name:'Stephen Sadler', branch:'sadler', srcs:['master'], desc:'Son of Owen and Beverley; married Linda Berg.'});
person({id:'rupert', name:'Rupert Morling', branch:'other', srcs:['master'], desc:'Married Sophia Sadler.'});
person({id:'linda', name:'Linda Berg', branch:'other', srcs:['master'], desc:'Married Stephen Sadler.'});
person({id:'persephone', name:'Persephone Morling', branch:'sadler', srcs:['master']});
person({id:'teddy', name:'Edward Morling', nicknames:['Teddy'], branch:'sadler', srcs:['master']});
person({id:'ophelia', name:'Ophelia Sadler', branch:'sadler', srcs:['master']});
person({id:'theodore', name:'Theodore Sadler', branch:'sadler', srcs:['master']});
person({id:'tevin', name:'Tevin Topias Sadler', branch:'sadler', srcs:['conf'],
  desc:'Son of Stephen Sadler and Linda Berg.',
  extra:['Confirmed by the family (August 2026) as a son of Stephen and Linda, alongside his brother Troy. Not present in the July 2026 export; added on the family\u2019s word.']});
person({id:'troy', name:'Troy Henrick Sadler', branch:'sadler', srcs:['conf'],
  desc:'Son of Stephen Sadler and Linda Berg.',
  extra:['Confirmed by the family (August 2026) as a son of Stephen and Linda, alongside his brother Tevin. Not present in the July 2026 export; added on the family\u2019s word.']});
person({id:'steve', name:'Steve Sadler', branch:'sadler', srcs:['master']});
person({id:'debbie', name:'Debbie Sadler', branch:'sadler', srcs:['master']});
person({id:'simone', name:'Simone Sadler', branch:'sadler', srcs:['master']});
person({id:'norris', name:'Norris Sadler', branch:'sadler', srcs:['master']});
person({id:'gary', name:'Gary Sadler', branch:'sadler', srcs:['master']});
person({id:'mark', name:'Mark Sadler', branch:'sadler', srcs:['master'],
  birth:{year:1973, date:'18 June 1973'}, desc:'Son of Clifford and Hazel; married Karen.'});
person({id:'michelle', name:'Michelle Sadler', branch:'sadler', srcs:['master'],
  birth:{place:'North Middlesex Hospital, London, UK'}, places:['London, UK'],
  desc:'Daughter of Clifford and Hazel; born at North Middlesex Hospital, London.'});
person({id:'karen', name:'Karen Sadler', branch:'other', srcs:['master'], desc:'Married Mark Sadler.'});
person({id:'marie-m', name:'Marie Sadler', branch:'sadler', srcs:['master'],
  birth:{year:2002, date:'13 October 2002'}, desc:'Daughter of Mark and Karen — the youngest dated member of the tree.'});
person({id:'trudi', name:'Trudi Wynter', branch:'sadler', srcs:['master']});
person({id:'chadwick', name:'Chadwick Wynter', branch:'sadler', srcs:['master']});
person({id:'melissa', name:'Melissa Sadler', branch:'sadler', srcs:['master']});
person({id:'stephanie', name:'Stephanie Sadler', branch:'sadler', srcs:['master']});
person({id:'lisa', name:'Lisa Sadler', branch:'sadler', srcs:['master'], desc:'Daughter of Canute and Michelle; married Ken.'});
person({id:'ken', name:'Ken', branch:'other', srcs:['master'], desc:'Married Lisa Sadler.'});
person({id:'lisa-c', name:'Unnamed', branch:'sadler', srcs:['master'], desc:'Child of Lisa and Ken; name not yet recorded.'});
person({id:'kevin', name:'Kevin Sadler', branch:'sadler', srcs:['master','conf'],
  desc:'Son of Canute; married Tamika, with two children.'});
person({id:'tamika', name:'Tamika', branch:'other', srcs:['conf'],
  desc:'Married Kevin Sadler; surname not yet recorded.',
  extra:['Added per family confirmation (August 2026). Surname not yet known.']});
person({id:'kevin-c1', name:'Unnamed Sadler', branch:'sadler', srcs:['conf'],
  desc:'Child of Kevin and Tamika; name not yet recorded.',
  extra:['Added per family confirmation (August 2026): Kevin has two children. Names not yet recorded.']});
person({id:'kevin-c2', name:'Unnamed Sadler', branch:'sadler', srcs:['conf'],
  desc:'Child of Kevin and Tamika; name not yet recorded.',
  extra:['Added per family confirmation (August 2026): Kevin has two children. Names not yet recorded.']});
person({id:'shona', name:'Shona Sadler', branch:'sadler', srcs:['master','conf'],
  desc:'Daughter of Canute; has two children.'});
person({id:'shona-c1', name:'Unnamed Sadler', branch:'sadler', srcs:['conf'],
  desc:'Child of Shona Sadler; name not yet recorded.',
  extra:['Added per family confirmation (August 2026): Shona has two children. Names not yet recorded.']});
person({id:'shona-c2', name:'Unnamed Sadler', branch:'sadler', srcs:['conf'],
  desc:'Child of Shona Sadler; name not yet recorded.',
  extra:['Added per family confirmation (August 2026): Shona has two children. Names not yet recorded.']});
person({id:'lauren', name:'Lauren Sadler', branch:'sadler', srcs:['master']});
person({id:'kurt', name:'Kurt Sadler', branch:'sadler', srcs:['master']});
person({id:'kyle', name:'Kyle Sadler', branch:'sadler', srcs:['master','conf'],
  desc:'Son of Kingsley; has a partner and one child.'});
person({id:'kyle-p', name:'Unnamed', branch:'other', srcs:['conf'],
  desc:'Partner of Kyle Sadler; name not yet recorded.',
  extra:['Added per family confirmation (August 2026): Kyle has a partner. Name not yet recorded.']});
person({id:'kyle-c1', name:'Unnamed Sadler', branch:'sadler', srcs:['conf'],
  desc:'Child of Kyle Sadler; name not yet recorded.',
  extra:['Added per family confirmation (August 2026): Kyle has one child. Name not yet recorded.']});

/* ============ Hesra's children ============ */
person({id:'hueburt', name:'Hueburt Sadler', branch:'sadler', srcs:['master']});
person({id:'ruel', name:'Ruel Sadler', branch:'sadler', srcs:['rtf'], extra:[RTF_NOTE]});
person({id:'glen-s', name:'Glen Sadler', branch:'sadler', srcs:['rtf'],
  roles:['Water commissioner, Cascade and Retrieve (Hanover)'], places:['Cascade and Retrieve, Hanover'],
  desc:'Water commissioner for Cascade and Retrieve, Hanover Parish, per the oral history.', extra:[RTF_NOTE]});

/* ============ Herga's children (Bigby) ============ */
['Vivian','Ted','Michael','Beryl','Hugh','Rollin','Vonnie','Antonio'].forEach((n,i)=>person({
  id:'hb'+i, name:n+' Bigby', nicknames:(n==='Hugh')?['Tat']:[], branch:'bigby', srcs:['doc'], surnameUncertain:true,
  desc:'Child of Herga (Sadler) and Lester Bigby.',
  extra:['Listed in the family document by first name only; the surname Bigby is inferred from the father and marked * until confirmed.']}));

/* ============ Harboury's children ============ */
person({id:'harboury-w', name:'Unnamed', branch:'other', srcs:['master'], desc:'Wife of Harboury Sadler; name not recorded.'});
person({id:'kingsley139', name:'Kingsley Sadler', branch:'sadler', srcs:['master'],
  desc:'Son of Harboury — a second Kingsley Sadler in the family, distinct from Jonah\u2019s son.'});
person({id:'kay', name:'Kay Sadler', branch:'sadler', srcs:['master']});
person({id:'herman', name:'Herman Sadler', branch:'sadler', srcs:['master']});

/* ============ FRAGMENT: Aiken ============ */
person({id:'martel', name:'Martel Aiken', branch:'aiken', srcs:['master']});
person({id:'mildred', name:'Mildred Aiken', branch:'aiken', srcs:['master']});
person({id:'fredrick', name:'Fredrick Aiken', branch:'aiken', srcs:['master']});
person({id:'veronica', name:'Veronica Aiken', branch:'other', srcs:['master']});
person({id:'lamark', name:'La mark Aiken', branch:'aiken', srcs:['master']});
person({id:'dionne', name:'Dionne Aiken', branch:'aiken', srcs:['master']});
person({id:'jayon', name:'Jayon', branch:'aiken', srcs:['master'], desc:'Child of Dionne Aiken; surname not recorded.'});
person({id:'griselda', name:'Griselda Aiken', branch:'aiken', srcs:['master'], spouseGhosts:['norman'],
  desc:'Married Norman Gordon — a second thread between the Aiken family and the Gordon network.'});

/* ============ FRAGMENT: Brissit → Gordon → Richards ============ */
person({id:'brissit0', name:'Unnamed Brissit', branch:'gordon', srcs:['master'],
  desc:'The earliest recorded member of the Brissit line; name not recorded.'});
person({id:'adlyn', name:'Adlyn Brissit', branch:'gordon', srcs:['master'],
  desc:'Married Amos Gordon; mother of the Gordon siblings.',
  flags:['A likely duplicate Adlyn Brissit record exists in the master data — still being checked, see Data review.']});
person({id:'amos1', name:'Amos Gordon', branch:'gordon', srcs:['master'],
  desc:'Married Adlyn Brissit; father of Cleopatra, Wilson, Joe, Uriah, Norman and Cecilia.',
  flags:['A second Amos Gordon appears in the Scotsman Gordon fragment. Whether they are the same man is an open question — if so, it would extend this line\u2019s ancestry. See Data review.']});
person({id:'cleopatra', name:'Cleopatra Gordon', branch:'gordon', srcs:['master'],
  desc:'Married three Richards men per the record — Lucal, Lucas and Ruphas.',
  flags:['Three husbands are recorded — Lucal, Lucas and Ruphas Richards. Whether these are three men or spelling variants of fewer is unresolved. See Data review.']});
person({id:'lucal', name:'Lucal Richards', branch:'gordon', srcs:['master'], desc:'First recorded husband of Cleopatra; father of Faye.'});
person({id:'lucas', name:'Lucas Richards', branch:'gordon', srcs:['master'], desc:'Second recorded husband of Cleopatra.'});
person({id:'ruphas', name:'Ruphas Richards', branch:'gordon', srcs:['master'], desc:'Third recorded husband of Cleopatra; father of Anne Marie, Dossy and Beverley.'});
person({id:'faye', name:'Faye Richards', branch:'gordon', srcs:['master']});
person({id:'annemarie', name:'Anne Marie Richards', branch:'gordon', srcs:['master']});
person({id:'dossy', name:'Dossy Richards', branch:'gordon', srcs:['master']});
person({id:'anotherson', name:'Unnamed Richards', branch:'gordon', srcs:['master'], desc:'Recorded in the master data as \u201CAnother Son Richards\u201D — name unknown.'});
person({id:'dominique', name:'Dominique Richards', branch:'gordon', srcs:['master']});
person({id:'wilson', name:'Wilson Gordon', branch:'gordon', srcs:['master']});
person({id:'merle', name:'Merle Gordon', branch:'other', srcs:['master']});
person({id:'oweng', name:'Owen Gordon', branch:'gordon', srcs:['master']});
person({id:'devon', name:'Devon Gordon', branch:'gordon', srcs:['master']});
person({id:'paulg', name:'Paul Gordon', branch:'gordon', srcs:['master']});
person({id:'sharon', name:'Sharon Gordon', branch:'gordon', srcs:['master']});
person({id:'joeg', name:'Joe Gordon', branch:'gordon', srcs:['master']});
person({id:'uriah', name:'Uriah Patrick', branch:'gordon', srcs:['master']});
person({id:'bevan', name:'Bevan Patrick', branch:'gordon', srcs:['master']});
person({id:'norman', name:'Norman Gordon', branch:'gordon', srcs:['master'], hideSpouses:['griselda'],
  desc:'Married Dorith Duncan; also married Griselda Aiken (shown in the Aiken fragment).'});
person({id:'dorith', name:'Dorith Duncan', branch:'other', srcs:['master']});
person({id:'deborah', name:'Deborah Gordon', branch:'gordon', srcs:['master']});
person({id:'susanne', name:'Susanne Gordon', branch:'gordon', srcs:['master']});
person({id:'paula', name:'Paula Gordon', branch:'gordon', srcs:['master'], desc:'Married Shaun Jordan.'});
person({id:'shaun', name:'Shaun Jordan', branch:'other', srcs:['master'], birth:{year:1968, date:'22 October 1968'}});
person({id:'tashan', name:'Tashan Jordan', branch:'gordon', srcs:['master'], birth:{year:1991, date:'26 October 1991'}});
person({id:'aaliyah', name:'Aaliyah Jordan', branch:'gordon', srcs:['master'], birth:{year:1997, date:'1 September 1997'}});
person({id:'marcia', name:'Marcia Gordon', branch:'gordon', srcs:['master']});
person({id:'dgreenaway', name:'Daniel Greenaway', branch:'gordon', srcs:['master'], desc:'Son of Marcia; married Laila Jordan.'});
person({id:'lailaj', name:'Laila Jordan', branch:'other', srcs:['master']});
person({id:'rayna', name:'Rayna Greenaway', branch:'gordon', srcs:['master']});
person({id:'india', name:'India Greenaway', branch:'gordon', srcs:['master']});
person({id:'nylah', name:'Nylah Greenaway', branch:'gordon', srcs:['master']});
person({id:'hazelene', name:'Hazelene Phillips', branch:'gordon', srcs:['master']});
person({id:'miap', name:'Mia Phillips', branch:'gordon', srcs:['master']});
person({id:'ashanti', name:'Ashanti Phillips', branch:'gordon', srcs:['master']});
person({id:'garygd', name:'Gary Gordon Duncan', branch:'gordon', srcs:['master']});
person({id:'cecilia', name:'Cecilia Miller', branch:'gordon', srcs:['master'], desc:'Married Clifford Smith.'});
person({id:'csmith', name:'Clifford Smith', branch:'other', srcs:['master']});

/* ============ FRAGMENT: Glen Bucknor ============ */
person({id:'glenb', name:'Glen Bucknor', branch:'bucknor', srcs:['master']});
person({id:'wilfrid', name:'Wilfrid Bucknor', branch:'bucknor', srcs:['master']});
person({id:'palma', name:'Palma Bucknor', branch:'bucknor', srcs:['master']});
person({id:'jenny', name:'Jenny Bucknor', branch:'bucknor', srcs:['rtf','conf'],
  desc:'Sister of Palma Bucknor, per family confirmation.',
  notes:'The oral history called her \u201CPalmer\u2019s sister\u201D. The family confirmed in review that she is Palma\u2019s sister — a child of Glen and Wilfrid Bucknor.',
  extra:[RTF_NOTE]});
person({id:'clive', name:'Clive Bucknor', branch:'bucknor', srcs:['master']});
person({id:'baldwin', name:'Baldwin Bucknor', branch:'bucknor', srcs:['master']});
person({id:'eugeni', name:'Eugeni Bucknor', branch:'bucknor', srcs:['master']});
person({id:'owenb', name:'Owen Bucknor', branch:'bucknor', srcs:['master']});

/* ============ FRAGMENT: Scotsman Gordon ============ */
person({id:'scotsman', name:'Scotsman Gordon', branch:'gordon', srcs:['master'],
  desc:'Head of a separate Gordon fragment that leads into the Samual and Grant lines.'});
person({id:'sg-unnamed', name:'Unnamed Gordon', branch:'gordon', srcs:['master'], desc:'Child of Scotsman Gordon; name not recorded.'});
person({id:'amos2', name:'Amos Gordon', branch:'gordon', srcs:['master'],
  desc:'Grandchild of Scotsman Gordon — a second Amos Gordon in the record.',
  flags:['May be the same man as the Amos Gordon who married Adlyn Brissit — unresolved. If they match, the Scotsman line becomes direct ancestry for the Gordon\u2013Richards network. See Data review.']});
person({id:'mertyl', name:'Mertyl Gordon', branch:'gordon', srcs:['master']});
person({id:'luceal', name:'Luceal Samual', branch:'gordon', srcs:['master']});
person({id:'oiliver', name:'Oiliver Samual', branch:'gordon', srcs:['master']});
person({id:'irene', name:'Irene Samual', branch:'gordon', srcs:['master']});
person({id:'sam-unnamed', name:'Unnamed Samual', branch:'gordon', srcs:['master'], desc:'Child of Irene Samual; name not recorded.'});
person({id:'jeff', name:'Jeff Samual', nicknames:['Claude'], branch:'gordon', srcs:['master']});
person({id:'joy', name:'Joy Grant', nicknames:['Grace'], branch:'gordon', srcs:['master']});
person({id:'janelle', name:'Janelle Samual', branch:'gordon', srcs:['master']});
person({id:'reece', name:'Reece Samual', branch:'gordon', srcs:['master']});
person({id:'rosemary', name:'Rosemary Grant', branch:'gordon', srcs:['master']});

/* ============ Isolated singles ============ */
person({id:'adele', name:'Adele Bucknor', branch:'bucknor', srcs:['master'], desc:'No recorded family links yet.'});
person({id:'bell', name:'Bell Bucknor', branch:'bucknor', srcs:['master'], desc:'No recorded family links yet.'});
person({id:'grey', name:'Grey Bucknor', branch:'bucknor', srcs:['master'], desc:'No recorded family links yet.'});
person({id:'helen', name:'Helen Bucknor', branch:'bucknor', srcs:['master'], desc:'No recorded family links yet.'});
person({id:'madere', name:'Madere Bucknor', branch:'bucknor', srcs:['master'], desc:'No recorded family links yet.'});
person({id:'manman', name:'Manman Bucknor', branch:'bucknor', srcs:['master'], desc:'No recorded family links yet.'});

/* ============ RELATIONSHIPS ============ */
marry('bull-father','bull-mother');
marry('malcolm-father','eliz-mother');
marry('daniel','elizabeth');
link(['malcolm-gf'],['malcolm-father']);
link(['bull-father','bull-mother'],['daniel','anne']);
link(['malcolm-father','eliz-mother'],['elizabeth']);
link(['daniel','elizabeth'],['lilian','berte','hilda','erskine','jonah','hesra','herga','michael','enid','harboury','monte','hortence','herbert','winnie','lester']);

marry('lilian','reginol');
link(['lilian','reginol'],['avis','lauris','epsi','gracep','elaine']);
marry('berte','mary');
link(['berte','mary'],['berte-d']);
link(['berte-d'],['berte-gd']);
link(['hilda'],['claire','palty','nanny','karl']);
link(['erskine'],['erskd1','erskd2','erskd3']);
marry('herga','lbigby');
link(['herga','lbigby'],['hb0','hb1','hb2','hb3','hb4','hb5','hb6','hb7']);
link(['hesra'],['hueburt','ruel','glen-s']);
marry('harboury','harboury-w');
link(['harboury','harboury-w'],['kingsley139','kay','herman']);

marry('jonah','gertrude');
link(['jonah','gertrude'],['louis','unnamed155','owen','romel','annie','carmen','canute','kingsley']);
link(['jonah'],['trevor','clifford']); /* mothers unknown — see Data review */

marry('louis','christine'); marry('louis','marie-l');
link(['louis','marie-l'],['noita']);
link(['louis'],['april']); /* mother not stated — attached to Louis alone */
link(['trevor'],['trevor-d','trevor-s']);
marry('owen','beverley');
link(['owen','beverley'],['sophia','stephen']);
marry('sophia','rupert');
link(['sophia','rupert'],['persephone','teddy']);
marry('stephen','linda');
link(['stephen','linda'],['ophelia','theodore','tevin','troy']);
link(['romel'],['steve','debbie','simone','norris','gary']);
marry('clifford','hazel');
link(['clifford','hazel'],['mark','michelle']);
marry('mark','karen');
link(['mark','karen'],['marie-m']);
marry('carmen','wynter');
link(['carmen','wynter'],['trudi','chadwick']);
marry('canute','michelle-c');
link(['canute','michelle-c'],['melissa','stephanie','lisa','kevin','shona']);
marry('kevin','tamika');
link(['kevin','tamika'],['kevin-c1','kevin-c2']);
link(['shona'],['shona-c1','shona-c2']); /* partner not recorded */
marry('kyle','kyle-p');
link(['kyle','kyle-p'],['kyle-c1']);
marry('lisa','ken');
link(['lisa','ken'],['lisa-c']);
marry('kingsley','leila');
link(['kingsley','leila'],['lauren','kurt','kyle']);

/* Aiken fragment */
marry('martel','mildred');
link(['martel','mildred'],['fredrick','griselda']);
marry('fredrick','veronica');
link(['fredrick','veronica'],['lamark','dionne']);
link(['dionne'],['jayon']);
marry('griselda','norman');

/* Brissit fragment */
link(['brissit0'],['adlyn']);
marry('adlyn','amos1');
link(['adlyn','amos1'],['cleopatra','wilson','joeg','uriah','norman','cecilia']);
marry('cleopatra','lucal'); marry('cleopatra','lucas'); marry('cleopatra','ruphas');
link(['cleopatra','lucal'],['faye']);
link(['cleopatra','ruphas'],['annemarie','dossy','beverley']);
link(['dossy'],['anotherson','dominique']);
marry('wilson','merle');
link(['wilson','merle'],['oweng','devon','paulg','sharon']);
link(['uriah'],['bevan']);
marry('norman','dorith');
link(['norman','dorith'],['deborah','susanne','paula','marcia','garygd']);
marry('paula','shaun');
link(['paula','shaun'],['tashan','aaliyah']);
link(['marcia'],['dgreenaway','hazelene']);
marry('dgreenaway','lailaj');
link(['dgreenaway','lailaj'],['rayna','india','nylah']);
link(['hazelene'],['miap','ashanti']);
marry('cecilia','csmith');

/* Bucknor fragment (Jenny confirmed as Glen & Wilfrid's daughter) */
marry('glenb','wilfrid');
link(['glenb','wilfrid'],['palma','jenny','clive','baldwin','eugeni','owenb']);

/* Scotsman fragment */
link(['scotsman'],['sg-unnamed']);
link(['sg-unnamed'],['amos2','mertyl','luceal']);
link(['luceal'],['oiliver','irene']);
link(['irene'],['sam-unnamed']);
link(['sam-unnamed'],['jeff','joy']);
link(['jeff'],['janelle','reece']);
link(['joy'],['rosemary']);

/* ============ FRAGMENT + GENERATION METADATA ============ */
const ROOTS = [
  {root:'malcolm-gf', frag:'trunk', d:0},
  {root:'bull-father', frag:'trunk', d:1},
  {root:'martel', frag:'aiken', d:0},
  {root:'brissit0', frag:'brissit', d:0},
  {root:'glenb', frag:'bucknorf', d:0},
  {root:'scotsman', frag:'scotsman', d:0},
];
(function assignMeta(){
  /* pass 1 — lines of descent only, so a person's generation follows their parents */
  const q=[];
  ROOTS.forEach(r=>{ if(P[r.root].frag===undefined){ P[r.root].frag=r.frag; P[r.root].depth=r.d; q.push(r.root); } });
  while(q.length){
    const id=q.shift(); const p=P[id];
    p.children.forEach(c=>{ if(P[c].frag===undefined){ P[c].frag=p.frag; P[c].depth=p.depth+1; q.push(c); } });
  }
  /* pass 2 — married-in partners inherit from their spouse */
  let changed=true;
  while(changed){
    changed=false;
    Object.values(P).forEach(p=>{
      if(p.frag!==undefined) return;
      const s=p.spouses.find(sp=>P[sp].frag!==undefined);
      if(s){ p.frag=P[s].frag; p.depth=P[s].depth; changed=true; }
    });
  }
  Object.values(P).forEach(p=>{ if(p.frag===undefined){ p.frag='unplaced'; p.depth=0; } });
})();

/* ============ SHARED HELPERS ============ */
const $ = s=>document.querySelector(s);
const all = Object.values(P);
function yearsOf(p){
  const b = p.birth&&p.birth.year ? p.birth.year : null;
  const d = p.death&&p.death.year ? (p.death.approx?'~'+p.death.year:p.death.year) : null;
  if(b&&d) return b+' – '+d;
  if(b) return 'b. '+((p.birth.approx?'~':'')+b);
  if(d) return 'd. '+d;
  return 'dates not recorded';
}
function lifespan(p){
  if(p.birth&&p.birth.year&&p.death&&p.death.year){
    const n = p.death.year-p.birth.year;
    return (p.death.approx||p.birth.approx?'about ':'')+n+' years';
  }
  return null;
}
function displayName(p){ return p.name + (p.surnameUncertain?' *':''); }
function genLabel(p){
  if(p.frag==='unplaced') return 'Not yet placed in a family';
  return 'Generation '+(p.depth+1)+' · '+FRAG_NAMES[p.frag];
}
