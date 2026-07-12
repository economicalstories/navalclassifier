export const classes = [
  { id: 'patrol', label: 'Patrol', key: 'A', icon: '🛡️' },
  { id: 'civilian', label: 'Civilian', key: 'S', icon: '⚓' },
  { id: 'support', label: 'Support', key: 'D', icon: '🏗️' },
  { id: 'absurd', label: 'Absurd', key: 'F', icon: '📎' }
];

export const boats = [
  { id: 'patrol-boat', name: 'Harbour Watch 12', classId: 'patrol', phase: 'Basic Recognition', emoji: '🚤', duration: 8200, size: 1, wake: 'short', clue: 'Blue light, antenna cluster, one clipboard.', lockClue: 'The clipboard is laminated. Definitely patrol.', feedback: 'A tidy patrol boat with a regulation amount of authority.' },
  { id: 'ferry', name: 'MV Public Consultation', classId: 'civilian', phase: 'Basic Recognition', emoji: '⛴️', duration: 8800, size: 1.25, wake: 'wide', clue: 'Boxy profile, passenger windows, ramp doors.', lockClue: 'Commuters on deck are pretending not to hear the radio.', feedback: 'Sometimes a ferry is permitted to simply be a ferry.' },
  { id: 'introvert-sub', name: 'HMAS Introvert', classId: 'patrol', phase: 'Operational Ambiguity', emoji: '🛳️', duration: 7200, size: 1.05, wake: 'thin', clue: 'Dark hull, tiny sail, no social availability.', lockClue: 'It dives whenever a meeting invite is mentioned.', feedback: 'Classified as a naval asset despite declining stakeholder engagement.' },
  { id: 'grant-extension', name: 'RV Grant Extension', classId: 'support', phase: 'Operational Ambiguity', emoji: '🚢', duration: 7000, size: 1.15, wake: 'wide', clue: 'Trawler hull, sensors, suspiciously academic hats.', lockClue: 'The nets are mostly for spreadsheets.', feedback: 'Research support: the fish are incidental; the spreadsheet is the payload.' },
  { id: 'mild-obligation', name: 'OSV Mild Obligation', classId: 'support', phase: 'Bureaucratic Escalation', emoji: '🚢', duration: 6200, size: 1.2, wake: 'wide', clue: 'Crane, working deck, mystery containers.', lockClue: 'The invoice has more tonnage than the ship.', feedback: 'Offshore support vessel. No one has asked too many follow-up questions.' },
  { id: 'legacy-asset', name: 'Former HMAS Still Useful', classId: 'patrol', phase: 'Bureaucratic Escalation', emoji: '🛥️', duration: 5900, size: 1, wake: 'short', clue: 'Old grey hull, new banner, suspicious optimism.', lockClue: 'The ribbon-cutting podium is welded to the aft deck.', feedback: 'It stopped being old when the briefing called it legacy.' },
  { id: 'strategic-inflatable', name: 'Rigid Inflatable Future Option', classId: 'absurd', phase: 'Bureaucratic Escalation', emoji: '🛶', duration: 5400, size: 0.92, wake: 'thin', clue: 'Inflatable tubes with an absurd radar mast.', lockClue: 'Contractor decal detected. Reclassify immediately.', feedback: 'Bureaucratically correct. Visually a dinghy, funded as a platform.' },
  { id: 'kayak-trenchcoat', name: 'Composite Paddled Formation', classId: 'absurd', phase: 'The Sea Becomes Impossible', emoji: '🛶', duration: 4900, size: 1, wake: 'chaotic', clue: 'Tall canvas column, six paddles, poor balance.', lockClue: 'Three kayaks in a trench coat are insisting they are one vessel.', feedback: 'Unfortunately recognised under the kayaking capability review.' },
  { id: 'budget-carrier', name: 'HMAS Fiscal Restraint', classId: 'absurd', phase: 'The Sea Becomes Impossible', emoji: '🛳️', duration: 4600, size: 1.35, wake: 'wide', clue: 'Flat deck, one drone, many savings claims.', lockClue: 'The aircraft is tiny. The ambition is full displacement.', feedback: 'Budget-neutral aircraft carrier. Please clap for sovereign capability.' },
  { id: 'floating-kpi', name: 'Q4 Maritime Deliverable', classId: 'absurd', phase: 'The Sea Becomes Impossible', emoji: '📈', duration: 4200, size: 0.95, wake: 'chaotic', clue: 'No hull. Just a chart floating confidently.', lockClue: 'It has no propulsion, but it is moving the program forward.', feedback: 'Unidentified floating KPI successfully contained.' }
];

export const memos = [
  'SCAN first for bonus intel; classify before the vessel exits the screen.',
  'Keys A/S/D/F fire classification stamps without touching the glass.',
  'Near misses generate paperwork. Fast locks generate praise nobody will fund.',
  'Absurd does not mean random. Look for contractor logos, impossible geometry, or KPIs.'
];
