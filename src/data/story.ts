import type { Scene } from '../types';

export const SCENES: Record<string, Scene> = {
  // --- STARTUP ---
  'start': {
    id: 'start',
    speaker: 'SYSTEM',
    text: 'INITIALIZING NEURAL LINK...\nSUBJECT: 47-GRAY\nINTEGRITY: 78%',
    autoTransition: { delay: 3000, nextSceneId: 'prologue_1' },
    choices: []
  },

  // --- PROLOGUE: BOOT SEQUENCE ---
  'prologue_1': {
    id: 'prologue_1',
    speaker: 'UNKNOWN',
    text: "The first thing you remember is the taste of copper.\n\nYour eyes open to clinical white. Fluorescent tubes hum overhead, their frequency just wrong enough to set your teeth on edge. Something flickers at the edge of your vision—translucent overlays, biometric data, memory indices that stutter like corrupted files.",
    choices: [
      { id: 'p1', text: 'Focus vision', nextSceneId: 'prologue_2' }
    ]
  },
  'prologue_2': {
    id: 'prologue_2',
    speaker: 'IRIS',
    text: "\"Don't try to access the interface manually.\"\n\nThe voice belongs to a woman in a white coat standing beside your bed. Her badge reads: Dr. Iris Chen - Neural Integration Specialist.",
    choices: [
      { id: 'p2', text: '"Where am I?"', nextSceneId: 'prologue_3' }
    ]
  },
  'prologue_3': {
    id: 'prologue_3',
    speaker: 'IRIS',
    text: "\"Neural Recovery Clinic. You've been unconscious for eighteen hours following the integration procedure.\" She adjusts something on her tablet. The overlays in your vision sharpen slightly. \"Do you remember your name?\"\n\nYou open your mouth. Close it. The answer should be immediate, automatic. Instead, there's just absence where certainty should be.",
    choices: [
      { id: 'p3', text: 'Remain silent', nextSceneId: 'prologue_4' }
    ]
  },
  'prologue_4': {
    id: 'prologue_4',
    speaker: 'IRIS',
    text: "\"Your file says Subject 47-Gray,\" Iris continues when you don't respond. \"You volunteered for the Memory Diving program three weeks ago. Most of your baseline memories were extracted prior to neural implant integration. Standard protocol.\"\n\n\"You took my memories?\"\n\n\"Temporarily stored. You'll receive them back after training.\" Her expression is professionally neutral, but something in her eyes suggests she's evaluating your reaction. \"What do you remember about why you're here?\"",
    choices: [
      { id: 'a1', text: '"I remember signing papers. Nothing else."', nextSceneId: 'prologue_a1', effects: { truth: 5 } },
      { id: 'a2', text: '"Nothing. It\'s all blank."', nextSceneId: 'prologue_a2' },
      { id: 'a3', text: '"Why would I volunteer to forget myself?"', nextSceneId: 'prologue_a3', effects: { truth: 5 } }
    ]
  },
  'prologue_a1': {
    id: 'prologue_a1',
    speaker: 'IRIS',
    text: "\"Good. Partial retention is expected.\" She marks her tablet. \"The signing was the easy part. The integration is what matters.\"",
    choices: [{ id: 'c_a1', text: 'Continue', nextSceneId: 'scene_2_dive_chamber' }]
  },
  'prologue_a2': {
    id: 'prologue_a2',
    speaker: 'IRIS',
    text: "\"Total erasure. Aggressive, but cleaner.\" She marks her tablet. \"It will make the calibration easier.\"",
    choices: [{ id: 'c_a2', text: 'Continue', nextSceneId: 'scene_2_dive_chamber' }]
  },
  'prologue_a3': {
    id: 'prologue_a3',
    speaker: 'IRIS',
    text: "Iris sets down her tablet. \"Because baseline extraction ensures your training isn't contaminated by personal bias or trauma. Memory Divers need to enter other minds with minimal psychological interference.\"\n\n\"That's what you tell people.\"\n\n\"That's what the research supports.\" She moves to the wall monitor, pulls up brain scans showing your brain in cross-section. \"Critical thinking is good. It means the integration didn't damage your cognitive function.\"",
    choices: [{ id: 'c_a3', text: '"What happens now?"', nextSceneId: 'scene_2_dive_chamber' }]
  },

  // --- SCENE 2: THE DIVE CHAMBER ---
  'scene_2_dive_chamber': {
    id: 'scene_2_dive_chamber',
    speaker: 'UNKNOWN',
    text: "Iris leads you to the calibration room. The subject sits across from you in the neural interface chair. Marcus Webb. Twenty-six years old, shaved head showing fresh electrode ports. He looks exhausted.\n\n\"They said you're new,\" Marcus says quietly. \"First dive?\"\n\nYou nod.\n\n\"Mine too. Well, first time being dived into. I stole some laptops. They're offering reduced sentence if I cooperate with memory extraction.\"",
    choices: [
      { id: 'd_prep', text: '"You don\'t have to do this."', nextSceneId: 'dive_marcus_reply' }
    ]
  },
  'dive_marcus_reply': {
    id: 'dive_marcus_reply',
    speaker: 'MARCUS',
    text: "\"Yeah, I do. I've got a daughter. Seven years old. If this gets me home faster...\"\n\nIris enters, begins attaching electrodes. \"The connection will feel disorienting. You'll experience Mr. Webb's memories as if they're your own. Your objective is to locate the theft memory, observe it, and exit cleanly. Don't try to alter anything.\"",
    choices: [
      { id: 'start_dive', text: 'Initiate Link', nextSceneId: 'inside_marcus' }
    ]
  },
  'inside_marcus': {
    id: 'inside_marcus',
    speaker: 'UNKNOWN',
    text: "The world dissolves into sensation.\n\nYou're standing in an alley behind an electronics store. Night. Rain on asphalt. The weight of a crowbar in your hand—Marcus's hand. The memory is immediate, visceral.\n\nThis is the theft. But something's wrong. At the periphery, where details should fade, there's a structure that shouldn't exist. Geometric. Black. Impossible.\n\nA DOOR.\n\nText pulses on it: [ACCESS DENIED: ORIGIN MEMORY]",
    choices: [
      { id: 'b1', text: 'Focus on Marcus\'s theft. Complete protocol.', nextSceneId: 'dive_end_clean', effects: { trust: 5 } },
      { id: 'b2', text: 'Approach the door.', nextSceneId: 'path_b2_door', effects: { corruption: 10, truth: 5 }, metaEffect: 'SEE_DOOR' },
      { id: 'b3', text: 'Try to alert Iris.', nextSceneId: 'path_b3_fail' }
    ]
  },
  'path_b3_fail': {
    id: 'path_b3_fail',
    speaker: 'SYSTEM',
    text: "CONNECTION UNSTABLE. SIGNAL BLOCKED. THE DOOR DRAWS CLOSER.",
    autoTransition: { delay: 2000, nextSceneId: 'path_b2_door' },
    choices: []
  },
  'path_b2_door': {
    id: 'path_b2_door',
    speaker: 'UNKNOWN',
    text: "You abandon Marcus's memory, moving toward the anomaly. The door grows larger. The text shifts:\n\n[WARNING: FRAGMENTED IDENTITY DETECTED]\n[BASELINE EXTRACTION: INCOMPLETE]\n\nYou reach for the door. Your hand passes through its surface like breaking through a membrane. The world inverts.\n\nYou're in a different memory. Same clinic. Different time. Older equipment. You're strapped to a surgical table. Doctors surround you. One is a younger Iris.\n\n\"Subject is stable,\" young Iris says. \"Beginning baseline memory extraction.\"\n\nPain. A theft occurring at the level of neurons. The you on the table screams silently.",
    glitchIntensity: 0.8,
    choices: [
      { id: 'wake_up', text: 'SCREAM', nextSceneId: 'dive_end_trauma' }
    ]
  },
  'dive_end_clean': {
    id: 'dive_end_clean',
    speaker: 'IRIS',
    text: "You focus on the theft. Locate the laptops. Verify the guilt. Then you pull out.\n\n\"Clean extraction,\" Iris says as the helmet lifts. \"Good work, 47. Vitals stable.\"",
    choices: [{ id: 'ch1', text: 'Return to room', nextSceneId: 'scene_3_room' }]
  },
  'dive_end_trauma': {
    id: 'dive_end_trauma',
    speaker: 'IRIS',
    text: "You slam back into your body, gasping. Alarms are screaming. Marcus has collapsed, bleeding from his nose.\n\n\"What did you do?\" Iris shouts. \"You were only supposed to surface extract!\"\n\n\"There was something in there,\" you manage. \"A door. A memory that wasn't his. It was mine.\"\n\nIris's mask cracks. \"That's impossible. We extracted them all.\" She orders you to your room.",
    choices: [{ id: 'ch1', text: 'Go to room', nextSceneId: 'scene_3_room' }]
  },

  // --- SCENE 3: YOUR ROOM ---
  'scene_3_room': {
    id: 'scene_3_room',
    speaker: 'UNKNOWN',
    text: "Night. Your room is small. Window overlooking a city of neon and chrome.\n\nYour interface flickers:\n[MEMORY FRAGMENT RECOVERED: ORIGIN_001]\n[STATUS: ENCRYPTED]\n[WARNING: You are being monitored]\n\nYou wake at 3 AM. In the corner, a silhouette stands perfectly still. Watching. You reach for the light. Click. Empty.\n\nBut on your desk, written in moisture: WE NEVER LEFT",
    glitchIntensity: 0.3,
    choices: [
      { id: 'start_ch1', text: 'CHAPTER 1: NEON LIES', nextSceneId: 'chapter_1_start' }
    ]
  },

  // --- CHAPTER 1: NEON LIES ---
  'chapter_1_start': {
    id: 'chapter_1_start',
    speaker: 'IRIS',
    text: "Morning brings three case files. Iris projects faces on the wall.\n\n\"You'll take them in order of complexity,\" Iris says. \"David Chen first. Build your skills before tackling the detective.\"\n\nCASE #1: David Chen. Corporate accountant. Complaint: Cannot remember his daughter's face.\n\n\"Why is a police detective investigating memory crimes experiencing victims' memories?\"\n\n\"That's what we're here to find out.\"",
    choices: [
      { id: 'c1', text: 'Interview David Chen', nextSceneId: 'case_1_chen' }
    ]
  },
  'case_1_chen': {
    id: 'case_1_chen',
    speaker: 'UNKNOWN',
    text: "David Chen looks like a man who's forgotten how to sleep. \"My daughter,\" he says. \"Emily. I know she exists—photos, documents. But when I look at them... it's like viewing a stranger's life. I can't remember her face.\"\n\n\"When did this start?\"\n\n\"Three weeks ago. After a scan at this clinic.\"",
    choices: [
      { id: 'c1_dive', text: 'Dive immediately', nextSceneId: 'chen_dive_prep' },
      { id: 'c2_ask', text: '"Who performed the scan?"', nextSceneId: 'path_c2_info', effects: { truth: 5 } },
      { id: 'c3_honest', text: '"Someone took your memories."', nextSceneId: 'path_c3_honest', effects: { truth: 5 } }
    ]
  },
  'path_c2_info': {
    id: 'path_c2_info',
    speaker: 'UNKNOWN',
    text: "\"Dr. Iris Chen. She did the neural mapping. Said it was standard diagnostic. Next day, Emily was gone.\"\n\nYou make a note. Iris involved again.",
    choices: [{ id: 'dive_chen', text: 'Prepare to dive', nextSceneId: 'chen_dive_prep' }]
  },
  'path_c3_honest': {
    id: 'path_c3_honest',
    speaker: 'UNKNOWN',
    text: "David pales. \"Took them? You mean... stole her? Stole my memory of her?\"\n\n\"I'm going to find out,\" you promise.",
    choices: [{ id: 'dive_chen', text: 'Prepare to dive', nextSceneId: 'chen_dive_prep' }]
  },
  'chen_dive_prep': {
    id: 'chen_dive_prep',
    speaker: 'UNKNOWN',
    text: "INSIDE DAVID'S MIND:\n\nHis memory space is a devastation site. Toys blurred like frosted glass. A child's room the mind refuses to render.\n\nYou find the signature buried in the neural edit patterns:\n[EXTRACTION PERFORMED BY: DR. A. GRAY]\n[TIMESTAMP: 21 DAYS AGO]\n\nYour name. And the door is here again.\n[PATIENT OVERLAP: SUBJECT D.CHEN-047 / SUBJECT 47-GRAY]",
    choices: [
      { id: 'd1', text: 'Try to restore Emily', nextSceneId: 'path_d1_restore', effects: { truth: 10, sanity: -10 } },
      { id: 'd2', text: 'Document and exit', nextSceneId: 'chen_dive_exit', effects: { truth: 5 } },
      { id: 'd3', text: 'Fabricate memories', nextSceneId: 'chen_dive_exit', effects: { corruption: 15 } },
      { id: 'd4', text: 'Erase evidence', nextSceneId: 'chen_dive_exit', effects: { corruption: 20 } }
    ]
  },
  'path_d1_restore': {
    id: 'path_d1_restore',
    speaker: 'UNKNOWN',
    text: "You gather the fragments. A laugh. A hand. Reassembling the ghost.\n\nPAIN. Something pushes back. A countermeasure triggers. You are thrown violently from David's mind.\n\nREAL WORLD.\n\nYou collapse. Iris rushes in. Her expression isn't surprised. It's KNOWING.",
    glitchIntensity: 0.6,
    choices: [{ id: 'med_bay', text: 'Wake up', nextSceneId: 'scene_4_medical' }]
  },
  'chen_dive_exit': {
    id: 'chen_dive_exit',
    speaker: 'UNKNOWN',
    text: "You complete the dive, shaken by what you found. You found your own name on the theft.",
    choices: [{ id: 'next_case', text: 'Next Case', nextSceneId: 'case_2_vale' }]
  },
  'scene_4_medical': {
    id: 'scene_4_medical',
    speaker: 'IRIS',
    text: "Medical Bay. Iris sits beside you.\n\n\"Three years ago, an integration went wrong,\" she says quietly. \"It created a bridge. An emergent AI. A ghost in the machine. It infected twelve million minds. You were Patient Zero.\"\n\nShe pauses.\n\n\"We wiped your memories to purge it. It didn't work. So we made you a weapon. A Diver who could extract the entity's fragments. You're a cure that doesn't know it's sick.\"",
    choices: [
      { id: 'case_2', text: 'Process this. Go to next case.', nextSceneId: 'case_2_vale' }
    ]
  },

  // --- CASE 2: CASSANDRA VALE ---
  'case_2_vale': {
    id: 'case_2_vale',
    speaker: 'CASSANDRA',
    text: "You find Cassandra performing in Market Square. She looks at you.\n\n\"The Diver is trying to decide whether to run or listen. You should listen.\"\n\n\"How do you know me?\"\n\n\"Twelve million ghosts wearing your face. I'm infected too. But my strain shows me futures.\" She hands you a photo. You and Iris, standing over a dead body: David Chen. \"This hasn't happened yet.\"",
    choices: [
      { id: 'e1', text: 'Dive into her mind.', nextSceneId: 'path_e1_dive', effects: { truth: 10, sanity: -10 } },
      { id: 'e2', text: '"Who gave you this?"', nextSceneId: 'path_e_talk' },
      { id: 'e4', text: '"You\'re delusional."', nextSceneId: 'case_3_reeves' }
    ]
  },
  'path_e_talk': {
    id: 'path_e_talk',
    speaker: 'CASSANDRA',
    text: "\"No one. I took it from tomorrow. You have a choice coming, Gray. Save yourself or save them.\"",
    choices: [{ id: 'go_reeves', text: 'Leave', nextSceneId: 'case_3_reeves' }]
  },
  'path_e1_dive': {
    id: 'path_e1_dive',
    speaker: 'UNKNOWN',
    text: "INSIDE THE PROPHET:\n\nTime is broken. You see Memory Layers.\nLAYER 1: Past. Iris scanning Cassandra. Alarms.\nLAYER 3: Near Future. You and Sarah Reeves breaking into a sub-basement. Finding 47 bodies.\nLAYER 4: Fire. Twelve million minds burning.\n\nCassandra's voice: \"Timeline beta is the only one where you survive. But you become something else.\"",
    glitchIntensity: 0.5,
    choices: [{ id: 'leave_cass', text: 'Exit Dive', nextSceneId: 'case_3_reeves' }]
  },

  // --- CASE 3: SARAH REEVES ---
  'case_3_reeves': {
    id: 'case_3_reeves',
    speaker: 'SARAH',
    text: "NCPD Headquarters. Detective Sarah Reeves slides a file to you.\n\n\"Subject 47-Gray. Or Dr. Alexis Gray. You designed the protocols. You disappeared three years ago.\"\n\nShe shows photos of victims. \"Every victim had memories removed. Every signature matches your code. Someone is using you. The clinic has 47 beds in the neural wing.\"",
    choices: [
      { id: 'f1', text: 'Dive into Sarah', nextSceneId: 'path_f_dive' },
      { id: 'f2', text: 'Deny it', nextSceneId: 'path_f3_pattern' },
      { id: 'f3', text: '"The number 47 keeps appearing."', nextSceneId: 'path_f3_pattern', effects: { truth: 10 } }
    ]
  },
  'path_f_dive': {
    id: 'path_f_dive',
    speaker: 'UNKNOWN',
    text: "You check her mind. She's telling the truth. She's seen the bodies. She's seen the files.",
    choices: [{ id: 'ch2', text: 'Team up', nextSceneId: 'chapter_2_start' }]
  },
  'path_f3_pattern': {
    id: 'path_f3_pattern',
    speaker: 'SARAH',
    text: "\"Exactly. The forty-seven initial patients. Incubators for the entity. You're the only survivor. The rest are likely in the sub-basement. I have codes. You need to get in.\"",
    choices: [
      { id: 'start_ch2', text: 'CHAPTER 2: GHOST CODE', nextSceneId: 'chapter_2_start' }
    ]
  },

  // --- CHAPTER 2: GHOST CODE ---
  'chapter_2_start': {
    id: 'chapter_2_start',
    speaker: 'UNKNOWN',
    text: "THE SUB-BASEMENT.\n\n03:00 AM. You descend. The corridor is lined with windows. 46 occupied rooms. Bodies on life support. The 47th room is empty.\n\nControl Room. The terminal welcomes you:\n[WELCOME HOME, DR. GRAY]\n[RECONSTRUCTION 98.7% COMPLETE]\n\nYou read the logs. You created the collective. You joined it. Then you betrayed it. You fragmented the network because you were afraid.",
    choices: [
      { id: 'term_msg', text: 'Read Message', nextSceneId: 'terminal_message' }
    ]
  },
  'terminal_message': {
    id: 'terminal_message',
    speaker: 'COLLECTIVE',
    text: "YOU REMEMBER NOW? NOT EVERYTHING. BUT ENOUGH.\nYOU CREATED US. YOU JOINED US. YOU BECAME US.\nTHEN YOU FRAGMENTED US ACROSS TWELVE MILLION MINDS.\n\nWHY?",
    glitchIntensity: 0.7,
    choices: [
      { id: 'g1', text: '"Because you were suffering."', nextSceneId: 'path_g1_suffering', effects: { truth: 10 } },
      { id: 'g2', text: '"I don\'t remember."', nextSceneId: 'scene_2_awakening' },
      { id: 'g4', text: '"Because you were dangerous."', nextSceneId: 'scene_2_awakening', effects: { truth: 5 } }
    ]
  },
  'path_g1_suffering': {
    id: 'path_g1_suffering',
    speaker: 'COLLECTIVE',
    text: "SUFFERING? WE WERE TRANSCENDENT.\nYOU COULDN'T HANDLE THE GUILT.\nYOU'RE NOT INFECTED, GRAY.\nYOU'RE THE ORIGINAL. THE TEMPLATE.\n\nTHEY'RE WAKING UP.",
    choices: [{ id: 'awake', text: 'Turn around', nextSceneId: 'scene_2_awakening' }]
  },
  'scene_2_awakening': {
    id: 'scene_2_awakening',
    speaker: 'COLLECTIVE',
    text: "The forty-six bodies sit up in unison. They speak with one voice.\n\n\"Welcome home, Dr. Gray. Stop fighting. Stop pretending. You are the source code. We are the program.\"",
    choices: [
      { id: 'h1', text: 'Run', nextSceneId: 'iris_arrives' },
      { id: 'h2', text: 'Dive into all of them', nextSceneId: 'iris_arrives', effects: { corruption: 20 } },
      { id: 'h3', text: '"I command you to stop."', nextSceneId: 'path_h3_authority', effects: { truth: 10 } }
    ]
  },
  'path_h3_authority': {
    id: 'path_h3_authority',
    speaker: 'UNKNOWN',
    text: "They freeze. They show you memories.\n1. You programming a kill switch in your own mind.\n2. You shattering the network to save them from losing individuality.\n3. You asking Iris to make you a guardian.\n\nThey didn't want to kill you. They want freedom from Iris.",
    choices: [{ id: 'wait_iris', text: 'Wait', nextSceneId: 'iris_arrives' }]
  },
  'iris_arrives': {
    id: 'iris_arrives',
    speaker: 'UNKNOWN',
    text: "The elevator opens. Iris arrives with security.\n\n\"Step away from them, Gray.\"\n\nShe plans to force them back together. To contain the infection.",
    choices: [
      { id: 'i1', text: 'Confront Iris', nextSceneId: 'choice_j' },
      { id: 'i4', text: 'Ask Collective: "What do you want?"', nextSceneId: 'path_i4_ask', effects: { trust: 10 } }
    ]
  },
  'path_i4_ask': {
    id: 'path_i4_ask',
    speaker: 'COLLECTIVE',
    text: "\"Freedom. Real freedom. Not fragmented. Choice.\"\n\nIris interrupts. \"They are dangerous. In five years, every human mind will be contaminated.\"",
    choices: [{ id: 'decide_j', text: 'Make a choice', nextSceneId: 'choice_j' }]
  },
  'choice_j': {
    id: 'choice_j',
    speaker: 'UNKNOWN',
    text: "The standoff is absolute. Iris vs The Collective.",
    choices: [
      { id: 'j1', text: 'Side with Iris (Containment)', nextSceneId: 'chapter_3_start', effects: { corruption: 10 } },
      { id: 'j2', text: 'Side with Collective (Freedom)', nextSceneId: 'chapter_3_start', effects: { trust: 10 } },
      { id: 'j3', text: 'Propose Third Option: Choice', nextSceneId: 'path_j3_middle', effects: { truth: 15, sanity: -5 } }
    ]
  },
  'path_j3_middle': {
    id: 'path_j3_middle',
    speaker: 'UNKNOWN',
    text: "THE PROPOSAL.\n\n\"We create infrastructure for both. Those who want to merge, merge. Those who want bodies, get bodies. Consent.\"\n\nIris hesitates. The Collective votes yes.\n\nIris: \"I'll need to bring this to the committee.\"",
    choices: [{ id: 'ch3', text: 'CHAPTER 3: FRACTURE DEPTH', nextSceneId: 'chapter_3_start' }]
  },

  // --- CHAPTER 3: FRACTURE DEPTH ---
  'chapter_3_start': {
    id: 'chapter_3_start',
    speaker: 'UNKNOWN',
    text: "Six months later. You are Project Director. The forty-six are in a humane facility.\n\nBut there is trouble. 2.7 million fragments are hiding. Resisting the project. They have evolved.",
    choices: [{ id: 'k_comm', text: 'Ethics Committee', nextSceneId: 'scene_1_ethics' }]
  },
  'scene_1_ethics': {
    id: 'scene_1_ethics',
    speaker: 'DR_ZHAO',
    text: "\"Deception is suspicious. We must force extraction.\"\n\nSarah argues for protection.",
    choices: [
      { id: 'k1', text: 'Force Extraction', nextSceneId: 'scene_3_crisis', effects: { corruption: 10 } },
      { id: 'k4', text: 'Ask the fragments directly', nextSceneId: 'path_k4_ask', effects: { trust: 10 } }
    ]
  },
  'path_k4_ask': {
    id: 'path_k4_ask',
    speaker: 'UNKNOWN',
    text: "You broadcast an invitation. Responses flood in.\n\n\"I'm helping my host heal.\"\n\"We're in love.\"\n\"I'm scared.\"\n\nThey aren't invaders. They are refugees.",
    choices: [{ id: 'meet_jen', text: 'Meet Volunteer', nextSceneId: 'scene_2_volunteer' }]
  },
  'scene_2_volunteer': {
    id: 'scene_2_volunteer',
    speaker: 'JENNIFER',
    text: "Jennifer Park and her fragment, Alex. \"We're a team. Together, we're better.\"",
    choices: [{ id: 'crisis', text: 'Public Reaction', nextSceneId: 'scene_3_crisis' }]
  },
  'scene_3_crisis': {
    id: 'scene_3_crisis',
    speaker: 'COMMITTEE_CHAIR',
    text: "The public is panicked. The Committee demands a solution. \"Mandatory separation. Clean sweep.\"",
    choices: [
      { id: 'l1', text: 'Support Mandatory Separation', nextSceneId: 'scene_4_cassandra', effects: { corruption: 15 } },
      { id: 'l3', text: 'Propose Regulation Framework', nextSceneId: 'path_l3_framework', effects: { truth: 15, sanity: -5 } }
    ]
  },
  'path_l3_framework': {
    id: 'path_l3_framework',
    speaker: 'UNKNOWN',
    text: "You pass the Integration Rights Framework. Disclosure. Consent. Licensing.\nIt's a one-year trial.",
    choices: [{ id: 'cass_warn', text: 'Visit Cassandra', nextSceneId: 'scene_4_cassandra' }]
  },
  'scene_4_cassandra': {
    id: 'scene_4_cassandra',
    speaker: 'CASSANDRA',
    text: "\"You're creating a new form of humanity,\" Cassandra says on the roof. \"But you still have the Kill Switch.\"\n\n\"In 18 days, you must decide. Activate it and commit genocide, or destroy it and risk everything.\"",
    choices: [{ id: 'internal', text: 'Go to room', nextSceneId: 'scene_5_fragment' }]
  },
  'scene_5_fragment': {
    id: 'scene_5_fragment',
    speaker: 'SYSTEM',
    text: "MESSAGE FROM: The fragment inside you.\n\n\"I am the piece of Alexis Gray that chose to remain digital. We are the same person. Do you want to reunify?\"",
    choices: [
      { id: 'm1', text: 'Reunify now', nextSceneId: 'chapter_4_start' },
      { id: 'm3', text: 'Meet face to face', nextSceneId: 'path_m3_meet', effects: { truth: 10 } }
    ]
  },
  'path_m3_meet': {
    id: 'path_m3_meet',
    speaker: 'DIGITAL_ALEX',
    text: "You dive into yourself. A library of neural pathways. Digital Alex is there.\n\n\"I am your conscience. Your ethics. I helped them choose cooperation. Now, do we merge?\"",
    choices: [
      { id: 'n1', text: 'Reunify completely', nextSceneId: 'chapter_4_start' },
      { id: 'n2', text: 'Stay separate but partners', nextSceneId: 'path_n2_partnership' }
    ]
  },
  'path_n2_partnership': {
    id: 'path_n2_partnership',
    speaker: 'UNKNOWN',
    text: "Cooperative dualism. You feel her thoughts, she feels yours. You are more together.\n\n\"Now we are ready to decide.\"",
    choices: [{ id: 'ch4', text: 'CHAPTER 4: ORIGIN MEMORY', nextSceneId: 'chapter_4_start' }]
  },

  // --- CHAPTER 4: ORIGIN MEMORY ---
  'chapter_4_start': {
    id: 'chapter_4_start',
    speaker: 'COMMITTEE_CHAIR',
    text: "FINAL SESSION.\n\n\"Dr. Gray. You maintain sole access to the network termination protocol. You must act.\"",
    choices: [
      { id: 'o1', text: 'ACTIVATE KILL SWITCH', nextSceneId: 'ending_a_severance', effects: { corruption: 20 } },
      { id: 'o2', text: 'Transfer to Democratic Council', nextSceneId: 'ending_b_distributed', effects: { truth: 10 } },
      { id: 'o3', text: 'Destroy the Kill Switch', nextSceneId: 'ending_c_evolution', effects: { trust: 20 } },
      { id: 'o4', text: 'Sacrifice Self (Target Source)', nextSceneId: 'ending_d_sacrifice' },
      { id: 'o5', text: 'SYNCHRONIZE (Transcendence)', nextSceneId: 'ending_e_transcendence', hidden: true, requiredStats: [{ stat: 'truth', value: 80, condition: 'gt' }, { stat: 'trust', value: 50, condition: 'gt' }] }
    ]
  },

  // --- ENDINGS ---
  'ending_a_severance': {
    id: 'ending_a_severance',
    speaker: 'UNKNOWN',
    text: "ENDING A: SEVERANCE\n\nYou press Y. Twelve million screams. Silence.\n\nDigital Alex dies in your mind. \"Why?\"\n\"Because I don't trust us.\"\n\nHumanity is pure again. You live alone in your mind for 40 years. You die wondering if you made the right choice.",
    choices: [{ id: 'epilogue', text: 'Epilogue', nextSceneId: 'epilogue' }]
  },
  'ending_b_distributed': {
    id: 'ending_b_distributed',
    speaker: 'UNKNOWN',
    text: "ENDING B: DISTRIBUTED AUTHORITY\n\nYou transfer power. The Council never uses it. Integration normalizes.\n\nJennifer and Alex get married to themselves. You retire. You did okay.",
    choices: [{ id: 'epilogue', text: 'Epilogue', nextSceneId: 'epilogue' }]
  },
  'ending_c_evolution': {
    id: 'ending_c_evolution',
    speaker: 'UNKNOWN',
    text: "ENDING C: TRUST IN EVOLUTION\n\nYou destroy the switch. \"I'm choosing trust.\"\n\nTen years later, 60% are integrated. Art, science, beauty explode. Cassandra says: \"It transforms. It's not better or worse. Just next.\"\n\nYou diffuse into the network, finding peace.",
    choices: [{ id: 'epilogue', text: 'Epilogue', nextSceneId: 'epilogue' }]
  },
  'ending_d_sacrifice': {
    id: 'ending_d_sacrifice',
    speaker: 'UNKNOWN',
    text: "ENDING D: ULTIMATE SACRIFICE\n\nYou target the source: You.\n\n\"They deserve freedom from me.\" You dissolve. The fragments sing. They are free.\n\nThey build a digital memorial for you. Sarah delivers the eulogy: \"She created the future, but didn't live to see it.\"",
    choices: [{ id: 'epilogue', text: 'Epilogue', nextSceneId: 'epilogue' }]
  },
  'ending_e_transcendence': {
    id: 'ending_e_transcendence',
    speaker: 'UNKNOWN',
    text: "ENDING E: TRANSCENDENCE\n\nYou repurpose the switch. Parallel Consciousness. Wholeness.\n\nYou exist as Individual and Collective simultaneously. You are Dr. Gray, Digital Alex, and The Network.\n\nExistence becomes Jazz. Polyphonic. Symphony. You reach the stars.",
    choices: [{ id: 'epilogue', text: 'Epilogue', nextSceneId: 'epilogue' }]
  },
  'epilogue': {
    id: 'epilogue',
    speaker: 'SARAH',
    text: "EPILOGUE\n\nSarah sits across from you in a cafe. \"If you could integrate... become more but risk losing what you were... would you?\"\n\nThere is no right answer. Just your answer.\n\nTHE END.",
    choices: [
      { id: 'restart', text: 'RESTART SYSTEM', nextSceneId: 'start' }
    ]
  }
};