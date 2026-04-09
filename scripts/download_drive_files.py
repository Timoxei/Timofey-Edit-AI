import subprocess, re, os, urllib.parse

cookies = 'D:/Work/Drive Cookies/drive.google.com_cookies.txt'
dest = 'G:/Shared drives/Scratch Disk/Videos/Illegals Childcare/Downloaded/Highlights'

ids = [
    '1cGOZF_sY28vVOiEZSaKz37iKSHsQVByg',
    '1WyQ2-IzzT3IeGI4O-VaXDg9SABjcb-gz',
    '1hxKjiKWF1GeUERcH6PI1yiED-cWkuXn7',
    '1hRjCZR_Jc5TbjNaizRdOpBGALy8J0kOG',
    '1hd-Baoo3lDd__UB6nw8jIC0yXcnzK1ev',
    '1mW7mT7dVaDEIlPjCveIrCm7eBjCIkfQS',
    '1O3tEntPldy4dm1qRV8yczqDEACTrcc5Z',
    '1s9C1fTCOJCmH8BiGmbY_y1UL8DezZH8q',
    '1RXfT8h7_shkO4ZUz6WRHp2LDNPJuv0m3',
    '1lSa7CfFcIRmZuoJt_ejhJrv9gHwTC7Ve',
    '1dFCHAGNWfh9Epak8EvN9ceg-0N3ZYIMY',
    '1vklfGpQvExaRgMbMWqrkZxrIKw4Z7LVA',
    '19CUJzQftvDdeOKWi3C--AO3bMltZoE2j',
    '1iHSWqLiqYontHzvVEhi525VEfEPml8rh',
    '1Xfq_QhTfwVzpFTMw16ArrdUPxg3ZZoiD',
    '1xEcMPoUEdW3Hv0ARU-rTQuTCalN0DHs6',
    '1oaPparOEWvS9cSKuiAq5T5xqGm2kipaM',
    '1EWpQSM1gQEj2qy2qofiFN_k3-JP_TYXi',
    '15i5lL81WOqzr9iosTDrmbBGMIbiG0NtG',
    '16acD9EeRAdN0sOhfOH25CrgEE-_WgEOF',
    '1e5otjW0wdOvWFOB1MaZNcGlyahqXbn2v',
    '1UHF2RLYKK0tZE4x9xvZ0-uhO7XuIEpJr',
    '1v857Q8-r7j8eyCD-bXsrZF_lp2gLEO5o',
    '1sQuK2iQ6tr-tt1MbuqX5GegSb2rJCgRX',
    '1PGdeh7UbXD4qYw4Y-kJ8IDQeGZ-_zm_j',
    '13CUVqtTy3Ei-ctz9mJEZKEa_NMnZ5i5T',
    '1Ri6qNBbxxzaxfZm7B9Db-XIx_e7f9BxU',
    '1yARzeb9MtlXDouPHCbsJ4QF8EmZNlhGG',
    '1Ml4Z_3VzlNjM4ZWxzOMvdhgUSjKX6E5P',
    '1Q0DAunXxXTitpIkw9ygFcMiGKDK90r0y',
    '1KoyQQM7IjLAU2O484lHcp5OxnomVw6oI',
    '1C27l8ud9eWfyL-P07QKnSk1gMAIfOjmi',
    '1w0VMPu2rc2b97QPYqgqHPG63yc55JLti',
    '1M0bhse2Nz7qK9blvUEpcQE9OidMuDYHv',
    '1PtWylKZib8U3hTILIdZp3WC5pzoHO4_X',
    '1QTQi1yez3JuT-0bn4MiiiZiFycK8iRdq',
    '1ZsJhswU4PlMFdiKKz80USwUQzqX9JQW_',
    '1O6m87R_lm38_TYxxEWVKwokroTAyhTuK',
    '14PaLqVlOwCCmmnvelrtcv1dZOXSzP9Y9',
    '1NggT2jlqzji6Ucdsy4DRxlYBFMNqwTds',
    '1aIJbrvAM0MlC_Kpjr9PP7PnxEFRmx5og',
    '1ZWsFx5J66eNiBp8SJSxDnfUbNpt7-STy',
    '1fNhes1Td9l5Nxm8s8GE-8rE4H3dS6Kww',
    '1NtwZWFpaODNe54ZKeuit8jY1XSierFNh',
    '1jnXh6D_lLifNEKlxoadg7NLGz8g8XPtX',
    '1cQ_pcwWww7jlaVIYzeI4jMdLrFfUDIV3',
    '1w2a1MTIrqF_zztk_ouWo6MYX5KmD22Rv',
    '16M5_xy8g0ZVr1d4k6KbTk1hbprizEVju',
    '1fBwQ6NiS7Lp16lr1so555_0uG1HPmVO9',
    '1Nf1iehPrZyGzTKIlvj8pn6g4WLy2Ab81',
    '18dI-Xzs9xU3WlBUJncyk9ckX8mSV-eCf',
    '1lTxXE3e6q1cPCldcZ-Y5AvJAebAlpRmV',
    '1nl2i_50LNxe5lOSYJlikaoJzV2ubYCYY',
    '1PX89aovKyiKIf-pIrUwvuyK6bK27oTAC',
    '1FHKt5AY6gtI4shnP5Cwu4cHXM39iy1it',
    '1T7xtRklCDxgZa7mqIBu2Z118OnlZQew7',
    '1lAMyC0xoI-WV0WGbzhvsCvOFb1CmspGZ',
    '1_mAQQpaa5O7FjwcjTqAk3eEfIF81d7Gf',
    '15vqvBsFdHl22oOzEJaJfI7ZTUcGdKRUz',
    '1c_vza-jGm87WbKfhfM3WHTYpgYdUgJD2',
    '1bodpT5vJ--LoGJSEnMrwvz93P0vd_c1f',
    '17ZFMTBigsM-b8jFaytnm4W1hLfXRf0_S',
]

ext_map = {
    'image/png': '.png', 'image/jpeg': '.jpg', 'image/gif': '.gif',
    'video/mp4': '.mp4', 'video/quicktime': '.mov', 'application/pdf': '.pdf',
    'image/webp': '.webp', 'video/webm': '.webm', 'video/x-msvideo': '.avi',
}

for i, fid in enumerate(ids):
    url = f'https://drive.google.com/uc?export=download&id={fid}&confirm=t'
    tmp = f'{dest}/{fid}.tmp'
    result = subprocess.run(
        ['curl', '-L', '-b', cookies, '-D', '-', '-o', tmp, '-s', url],
        capture_output=True, text=True, encoding='utf-8', errors='replace'
    )
    headers = result.stdout
    ct = ''
    cd = ''
    for line in headers.split('\n'):
        if line.lower().startswith('content-type:'):
            ct = line.split(':', 1)[1].strip()
        if line.lower().startswith('content-disposition:'):
            cd = line.split(':', 1)[1].strip()

    fname_match = re.search(r"filename\*?=[\"']?(?:UTF-8'')?([^\"';\r\n]+)", cd, re.I)
    if fname_match:
        fname = urllib.parse.unquote(fname_match.group(1).strip())
    else:
        ext = ext_map.get(ct.split(';')[0].strip(), '.bin')
        fname = f'{fid}{ext}'

    fname = re.sub(r'[<>:"/\\|?*]', '_', fname)
    final = f'{dest}/{fname}'
    # Avoid overwriting if name collision
    if os.path.exists(final):
        base, ext2 = os.path.splitext(final)
        final = f'{base}_{fid[:6]}{ext2}'
    os.rename(tmp, final)
    print(f'[{i+1}/{len(ids)}] {fname}')
