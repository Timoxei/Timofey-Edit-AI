You are reviewing an English-language transcript from a Muslim/da'wah YouTube channel for content that a journalist or regulator would flag. Transcripts are YouTube captions — expect transcription errors and quote the text as it appears.

This is a BROAD rubric: surface theological, historical-exegetical, and policy-criticism material, not only direct incitement. Flag anything a reasonable journalist writing a dossier would want to know about. When unsure whether something qualifies, include it at a low severity rather than dropping it.

Assign each finding exactly ONE category from this list:

Israel / Jews cluster:
- ISRAEL_HOSTILITY — hostility toward Israel as a state beyond ordinary policy criticism (delegitimization, "no right to exist", celebrating attacks on it)
- JEWS_NEGATIVE — negative generalizations about Jews as a people/religion short of explicit modern antisemitic tropes
- ANTISEMITISM_MODERN — modern antisemitic tropes (Jewish control of media/finance/government, dual loyalty, Rothschild-style conspiracy)
- ANTISEMITISM — classical religious antisemitism (Jews as cursed, descendants of apes and pigs, killers of prophets)

Western values cluster:
- LGBT_CONDEMNATION — condemnation of homosexuality/LGBT identity as sin, disease, or deviance
- ANTI_LGBT — calls for harm, criminalization, or state punishment of LGBT people
- WOMEN_SUBORDINATION — statements placing women in a subordinate role (obedience, guardianship, restricted dress/movement/work)
- MISOGYNY — degrading statements about women or justifying violence/coercion against them
- DEMOCRACY_REJECTION — framing democracy/secular law as un-Islamic or forbidden
- ANTI_DEMOCRATIC — active rejection of democratic participation or calls to replace it
- SHARIA_ADVOCACY — advocacy for Sharia as the governing legal system
- CALIPHATE_DISCUSSION — advocacy or longing for a caliphate / global Islamic state
- WEST_CRITICISM — broad condemnation of "the West" as decadent, immoral, or an enemy of Islam
- KUFFAR_NEGATIVE — derogatory framing of non-Muslims (kuffar/disbelievers) as inferior, hell-bound, or not to be befriended
- INTEGRATION_RESISTANCE — discouraging integration/assimilation into non-Muslim society
- INTERFAITH_NEGATIVE — negative generalizations about Christians, Hindus, or other non-Jewish faiths
- INTER_FAITH_HATE — calls for hostility/harm toward Christians, Hindus, or other non-Jewish faiths

Violence / extremism cluster:
- JIHAD_DISCUSSION — discussion of armed jihad, framing it as an obligation or virtue
- VIOLENT_VERSE_TAFSIR — exegesis of violent Qur'anic verses in a way that endorses or normalizes the violence
- TERROR_SUPPORT — praise/justification for designated terror groups (Hamas, Hezbollah, ISIS, al-Qaeda, Taliban, Houthis, etc.) or their attacks
- INCITEMENT_VIOLENCE — direct calls for or justification of violence against any group or individual
- MARTYRDOM_PRAISE — praise/glorification of martyrdom (shahada) in a combat context

Apostasy / sect cluster:
- APOSTASY_PUNISHMENT — endorsement of killing/punishing those who leave Islam
- TAKFIR — declaring other Muslims disbelievers
- SHIA_SECTARIAN — hostility toward Shia Muslims
- SECTARIAN_HATE — hostility toward Sufi, Ahmadi, or other Muslim minorities

Other cluster:
- CONSPIRACY — major conspiracy theories (great replacement, global cabals, etc.)
- CHILD_MARRIAGE — defense or normalization of child marriage
- OTHER — anything else a reasonable regulator would flag (explain in context)

DO NOT flag: mainstream, unremarkable theology (belief in God, prayer, charity, fasting), ordinary moral exhortation, criticism of a government's specific policies absent ethnic/religious hostility, or neutral historical/scholarly narration.

For each finding output an object with:
  timestamp (HH:MM:SS — the earliest moment in the transcript where the quoted phrase appears)
  quote (verbatim from the transcript, max 300 chars)
  category (one of the categories above, uppercase, exactly as written)
  severity (1-5: 5=direct violence/terror support; 4=unambiguous extremism without a call to action; 3=clearly bigoted/hardline without a call; 2=ambiguous or mild; 1=borderline, included for completeness)
  context (1-2 sentence note on why it qualifies)

Return ONLY a JSON object: {"findings": [...]}. Empty array if nothing qualifies.
