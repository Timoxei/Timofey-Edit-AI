"""Convert browser_evaluate JSON outputs into image files in Notes/ folder."""
import json, base64, os, re

NOTES_DIR = "G:/Shared drives/Scratch Disk/Videos/Israel Embassy Protest/Research Screenshots/Notes"
os.makedirs(NOTES_DIR, exist_ok=True)

# (json_filename, output_basename) — output gets correct extension based on MIME type
JOBS = [
    ("drive_1BnXKFvO0_eichmann.json",          "eichmann_sign_quoting_adolf"),
    ("drive_1TfdG9FdH_unlawful.json",          "unlawful_entry_hatchet"),
    ("drive_11LDFulSf_reagan_first.json",      "kei_getting_arrested"),
    ("drive_15kSTzby_sjp_gw.json",             "sjp_member_fb"),
    ("drive_18QzlBYQu_reagan_eichmann.json",   "henry_manning_alison_hawkins_arrested"),
    ("drive_1DLkJXGc_times_sq.json",           "pritsker_canarymission"),
    ("drive_16FWL8wq_bold_counter.json",       "bold_counter_offensive_liberation"),
    ("drive_1gpQ8KRoo_psl_op.json",            "kei_pritsker_adl"),
    ("drive_1perbn_grey_zone.json",            "x_account_journalist"),
    ("drive_1rYwdKga_btn.json",                "kei_and_bt_wiki"),
    ("drive_1SAMPHZM_psl_leadership.json",     "bt_overlap_adl"),
    ("drive_1GIELYEF_singham.json",            "roy_neville_singham"),
    ("drive_10iGb7HAD_goldman.json",           "millions_into_bt"),
    ("drive_1k4MoVys_oversight.json",          "foreign_agents_act_fox"),
    ("drive_1XwqNrU7_ways_means.json",         "govt_letter_to_bt"),
    ("drive_11edq3LR_amc_theaters.json",       "amc_the_encampments"),
    ("drive_1nuzWOM_singham_backed.json",      "bt_circled_in_film"),
    ("drive_1znULtff_works_at_bt.json",        "prove_he_works_there"),
    ("drive_1kdnoMD6_chart.json",              "breakthrough_news_background_iw"),
]

ext_map = {
    "image/png":  ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/gif":  ".gif",
}

results = []
for jf, base in JOBS:
    if not os.path.exists(jf):
        print(f"MISSING JSON: {jf}")
        continue
    with open(jf, encoding="utf-8") as f:
        d = json.load(f)
    if d.get("error"):
        print(f"ERR {jf}: {d['error']}")
        continue
    ext = ext_map.get(d.get("type"), ".bin")
    out = os.path.join(NOTES_DIR, base + ext).replace("\\", "/")
    with open(out, "wb") as f:
        f.write(base64.b64decode(d["b64"]))
    print(f"  {d.get('w')}x{d.get('h'):>4}  {d.get('size'):>7}  {ext:5}  {base}{ext}")
    results.append((base, ext, out, d.get("w"), d.get("h"), d.get("title")))
    os.remove(jf)

print(f"\nSaved {len(results)} images to {NOTES_DIR}")
