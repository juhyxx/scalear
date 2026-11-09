#!/bin/sh
# Rebuilds audio/guitar/<midi>.mp3, the jazz guitar notes the app plays.
#
# Source: Shinyguitar by Karoryfer Samples, an archtop guitar sampled by D. Smolken, released
# under CC0 1.0 (public domain): https://github.com/sfzinstruments/karoryfer.shinyguitar
# We take the magnetic pickup recording ("electric"), the third of four velocity layers and the
# first round robin, of each of its 17 sampled notes (a minor third apart, D♭2 to C6), then trim
# each to 3.6 s with a fade, normalise its peak to −3 dB, and encode it as 80 kb/s mono MP3.
# src/audio.js repitches the nearest sample for every other note.
#
# Needs curl and ffmpeg (with libmp3lame). Usage: tools/guitar-samples.sh [work-dir]
set -eu

COMMIT=57243cca85277dbcc120ce17c6178032f93c80f3
BASE="https://raw.githubusercontent.com/sfzinstruments/karoryfer.shinyguitar/$COMMIT/Samples/electric"
NOTES="db2:37 e2:40 gb2:42 a2:45 c3:48 eb3:51 gb3:54 a3:57 c4:60 eb4:63 gb4:66 a4:69 c5:72 eb5:75 gb5:78 a5:81 c6:84"

work="${1:-$(mktemp -d)}"
out="$(cd "$(dirname "$0")/.." && pwd)/audio/guitar"
mkdir -p "$work" "$out"

for pair in $NOTES; do
  name="${pair%%:*}"
  midi="${pair##*:}"
  wav="$work/$name.wav"
  [ -s "$wav" ] || curl -sfL -o "$wav" "$BASE/${name}_vl3_rr1_2.wav"
  peak=$(ffmpeg -hide_banner -i "$wav" -t 3.6 -af volumedetect -f null - 2>&1 | sed -n 's/.*max_volume: \(-*[0-9.]*\) dB/\1/p')
  gain=$(echo "-3 - ($peak)" | bc)
  ffmpeg -v error -y -i "$wav" -t 3.6 -map_metadata -1 \
    -af "volume=${gain}dB,afade=t=out:st=2.6:d=1.0" \
    -ac 1 -ar 44100 -c:a libmp3lame -b:a 80k "$out/$midi.mp3"
  echo "$name → audio/guitar/$midi.mp3 (peak $peak dB, gain $gain dB)"
done
