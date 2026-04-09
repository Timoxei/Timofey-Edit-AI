import json, re
from difflib import SequenceMatcher

with open('D:/Claude Experiments/ai_voiceover_transcript.json') as f:
    words = json.load(f)

# Normalize text for matching
def normalize(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

transcript_words = [normalize(w['word']) for w in words]
transcript_text = ' '.join(transcript_words)

def find_phrase_time(phrase, search_from=0):
    """Find the start time of a phrase in the transcript."""
    phrase_words = normalize(phrase).split()
    if not phrase_words:
        return None, search_from

    best_score = 0
    best_idx = None

    # Slide a window across the transcript
    window = len(phrase_words)
    for i in range(search_from, min(len(transcript_words) - window + 1, len(transcript_words))):
        window_words = transcript_words[i:i+window]
        window_text = ' '.join(window_words)
        phrase_text = ' '.join(phrase_words)
        score = SequenceMatcher(None, phrase_text, window_text).ratio()
        if score > best_score:
            best_score = score
            best_idx = i

    if best_idx is not None and best_score > 0.4:
        start_time = words[best_idx]['start']
        return round(start_time, 3), best_idx
    return None, search_from

# B-roll placements: (phrase_to_match, filename)
# Each phrase is what the AI voice says at that moment
placements_spec = [
    ("runs 70 locations across all five boroughs", "1953.png"),
    ("93.7 million in total revenue", "REV GROWS. PROPUBLICA.png"),
    ("CEO of The Child Center of NY is a woman named Traci Donnelly", "LinkedIn Account.png"),
    ("paid 56.2 million in total salaries", "55M wages.png"),
    ("1823 employees", "# of employees.png"),
    ("CEO made 603000", "2024 TRACI PAY.png"),
    ("CFO made 403000", "2024 STEPHEN PAY.png"),
    ("top seven executives collectively took home 2.7 million", "Top employees.png"),
    ("backed by a landmark investment from The Child Center of NY", "landmarck investment. make an impact.png"),
    ("Traci Donnelly was a senior executive at Phoenix House", "phoenix house.png"),
    ("Her CFO Stephen Donowitz", "Stephen Make an Impact.png"),
    ("Traci Donnelly a seat at the table", "Traci on Board. Chalkbeat.png"),
    ("deciding how New York City schools would reopen", "Advising Board. Chalkbeat.png"),
    ("According to the Governing news outlet", "Governing Header.png"),
    ("36 of NYC public school students became chronically absent", "36percent. Governing.png"),
    ("those in poverty were gone 45 of the year", "45 percent. Governing.png"),
    ("city's kids collectively lost over 17.5 million days of school", "17M Absent days. Governing.png"),
    ("6 billion a year on childcare expansion", "6B NPR.png"),
    ("state running a 10.5 billion deficit", "10B Deficit PBS.png"),
    ("Mayor Mamdani in action with the Child Center of NY", "child center,brooklyn, and madani.png"),
    ("another non profit making millions", "Brooklyn income.png"),
    ("Black Lives Matter collages", "blm.png"),
    ("books about race and identity being read aloud", "blm read aloud.png"),
    ("Transgender Visibility campaigns", "trans program.png"),
    ("Celebrating National Coming Out Day", "coming out day.png"),
    ("remembering George Floyd day", "george floyd.png"),
    ("Child Center of NY has partnered with Callen-Lorde", "only partnership with callen lorde.png"),
    ("fully equipped mobile medical van", "fully equiped van.png"),
    ("directly into residential facilities serving vulnerable kids", "partnership 2.png"),
    ("Clinical Coordinator Young Moon", "Affriming care andChild center of NY .png"),
    ("on-site access to hormone consultations", "Hormone care.png"),
    ("identity based counseling and medical treatment", "HOTT services highlighted.png"),
    ("No parental consent required", "Without parents consent.png"),
    ("serves kids ages 12 to 18", "12-18.png"),
    ("gender affirming care partnered with Callen-Lorde", "Partnership.png"),
    ("hormonal therapy including preferred names pronouns", "Hormonal therapy.png"),
    ("chest binders", "safe binding.webp"),
    ("mobile medical unit traveling across all five boroughs", "5 boroughs.png"),
    ("All services are provided free of charge or at low cost", "Free low cost.png"),
    ("register young people 21 and under", "21 to 24 bday.png"),
    ("75 of their enrollers have already identified as LGBTQ", "75% lgptq.png"),
    ("free of judgment and regardless of ability to pay", "REGARDLESS OF PAY.png"),
    ("program called HOTT Health Outreach to Teens", "Better header.png"),
    ("serving teens as young as 13", "13-24 care.png"),
    ("Fully stocked pharmacies", "Pharmacy locations.png"),
    ("Even free delivery", "Free delivery.png"),
    ("anyone can walk in even if you cannot pay", "FOR ANYONE, EVEN IF CANT PAY.png"),
    ("CEO of The Child Center of NY Traci Donnelly and the leadership", "LinkedIn Account.png"),
    ("Patrick McGovern", "Patrick McGovern LinkedIn.png"),
    ("Zohran Mamdanis health transition circle", "mamdani.png"),
    ("no cost to taxpayers pitch falls apart", "NO COST TO TAXPAYERS LIE.png"),
    ("131.4 million dollars in 2024", "2024 REVENUE 131M.png"),
    ("109.9 million", "2023 109M REVENUE.png"),
    ("14.3 million dollars 11 percent comes from donations", "2024 Contributions 14M.png"),
    ("116.6 million dollars in program services", "116M Program services.png"),
    ("Medicaid Medicare and government funded care", "cause iq medicaid.png"),
    ("when they say no cost to taxpayers you are looking at over 127 million", "NO COST TO TAXPAYERS LIE.png"),
    ("Fidelity Investments Charitable Gift Fund", "Fidelity Donation. Cause IQ.png"),
    ("Columbia University for research", "Columbia Univ Grant.png"),
    ("federal agents raided 20 Southern California locations", "NBC. Birthright scheme.png"),
    ("3 million in wire transfers", "500 ch. 3m wire.png"),
    ("chest binders tight compression garments", "safe binding.webp"),
    ("Texas Republicans have bypassed the traditional legislative process", "Texas tribune losing rights.png"),
    ("Plyler v Doe", "1982 plyer vs doe.png"),
    ("racial equity plan that directs government resources based on race", "mamdani.png"),
    ("45 agencies with over 200 goals", "NYC Gov. Preliminary Plan.png"),
]

results = []
search_from = 0
for phrase, filename in placements_spec:
    t, idx = find_phrase_time(phrase, search_from=max(0, search_from - 5))
    if t is not None:
        results.append({'phrase': phrase, 'file': filename, 'start_time': t, 'word_idx': idx})
        search_from = idx + 1
        print(f'  [{t:6.1f}s] {filename[:50]:<50} <- "{phrase[:50]}"')
    else:
        results.append({'phrase': phrase, 'file': filename, 'start_time': None, 'word_idx': None})
        print(f'  [NOTFOUND] {filename[:50]:<50} <- "{phrase[:50]}"')

output_path = 'D:/Claude Experiments/broll_placements.json'
with open(output_path, 'w') as f:
    json.dump(results, f, indent=2)

print(f'\nSaved {len(results)} placements to {output_path}')
found = sum(1 for r in results if r['start_time'] is not None)
print(f'Found: {found}/{len(results)}')
