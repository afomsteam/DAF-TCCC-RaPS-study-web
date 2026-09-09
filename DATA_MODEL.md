# Web Data Model

The web edition preserves the same browser-side records used by the Android/Capacitor baseline. The current schema includes class/session information, participant records, study arm/timepoint fields, attempt data, criterion-level ratings, timers, events, RCA/failure classifications, study metrics, signatures/acknowledgments, and export metadata.

Participant demographic/work fields include:

- Participant ID
- Name / rank
- Clinical years of experience
- AFSC
- Current work section / clinical area
- Study arm

Records are stored locally in browser `localStorage`. Backups and exports remain the portability/recovery mechanism for this release.
