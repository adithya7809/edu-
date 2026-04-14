import { Chapter, Subject, Goal, Exam } from './types';

const createChapter = (id: string, name: string, weightage: string, priority: 1 | 2 | 3 | 4): Chapter => ({
  id, name, weightage, priority, theory: false, dpp: false, chapterTest: false, revision1: false, revision2: false
});

const sortChapters = (chapters: Chapter[]) => {
  return chapters.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    const weightA = parseFloat(a.weightage.replace(/[^0-9.]/g, '')) || 0;
    const weightB = parseFloat(b.weightage.replace(/[^0-9.]/g, '')) || 0;
    return weightB - weightA;
  });
};

export const mockExams: Exam[] = [
  {
    id: 'mains',
    name: 'Joint Entrance Examination - Main (JEE-Main)',
    shortName: 'JEE Main',
    targetDate: '2026-04-02T09:00:00Z',
    overallProgress: 0,
    priority: 1,
    goals: [],
    milestones: [
      { id: 'm1', text: 'Syllabus Completion', date: '2026-03-25T00:00:00Z', type: 'revision' },
      { id: 'm2', text: 'Full Mock Test 1', date: '2026-03-28T00:00:00Z', type: 'mock-test' },
      { id: 'm3', text: 'Final Revision', date: '2026-03-31T00:00:00Z', type: 'revision' },
      { id: 'm4', text: 'JEE Main Exam', date: '2026-04-02T09:00:00Z', type: 'exam' },
    ],
    subjects: [
      {
        id: 'phy',
        name: 'Physics',
        progress: 0,
        chapters: sortChapters([
          createChapter('p1', 'Modern Physics', '12%', 1),
          createChapter('p2', 'Current Electricity', '10%', 1),
          createChapter('p3', 'Electrostatics', '10%', 1),
          createChapter('p4', 'Ray Optics', '8%', 1),
          createChapter('p5', 'Thermodynamics', '8%', 1),
          createChapter('p6', 'Units & Measurements', '6%', 2),
          createChapter('p7', 'Rotational Motion', '5%', 2),
          createChapter('p8', 'Wave Optics', '5%', 2),
          createChapter('p9', 'Magnetism', '5%', 2),
          createChapter('p10', 'Fluids/Solids', '5%', 2),
          createChapter('p11', 'Oscillations/Waves', '5%', 2),
          createChapter('p12', 'Work, Energy & Power', '4%', 2),
          createChapter('p13', 'Gravitation', '4%', 2),
          createChapter('p14', 'Semiconductors', '4%', 3),
          createChapter('p15', 'Kinematics', '3%', 3),
          createChapter('p16', 'NLM', '3%', 3),
          createChapter('p17', 'EM Waves', '3%', 3),
        ])
      },
      {
        id: 'chem',
        name: 'Chemistry',
        progress: 0,
        chapters: sortChapters([
          createChapter('c1', 'Aldehydes, Ketones & Carboxylic Acids', '10%', 1),
          createChapter('c2', 'Coordination Compounds', '8%', 1),
          createChapter('c3', 'General Organic Chemistry', '7%', 1),
          createChapter('c4', 'Chemical Bonding', '6%', 1),
          createChapter('c5', 'd and f Block Elements', '6%', 1),
          createChapter('c6', 'p-Block Elements', '6%', 1),
          createChapter('c7', 'Solutions', '5%', 2),
          createChapter('c8', 'Chemical Kinetics', '5%', 2),
          createChapter('c9', 'Electrochemistry', '5%', 2),
          createChapter('c10', 'Mole Concept', '5%', 2),
          createChapter('c11', 'Atomic Structure', '5%', 2),
          createChapter('c12', 'Hydrocarbons', '5%', 2),
          createChapter('c13', 'Nitrogen compounds', '5%', 2),
          createChapter('c14', 'Haloalkanes', '5%', 2),
          createChapter('c15', 'Biomolecules', '5%', 2),
          createChapter('c16', 'Thermodynamics', '4%', 3),
          createChapter('c17', 'Equilibrium', '4%', 3),
          createChapter('c18', 'Periodic Table', '4%', 3),
        ])
      },
      {
        id: 'math',
        name: 'Mathematics',
        progress: 0,
        chapters: sortChapters([
          createChapter('m1', 'Integration/Area', '10%', 1),
          createChapter('m2', 'LCD', '8%', 1),
          createChapter('m3', '3D Geometry', '8%', 1),
          createChapter('m4', 'Sequence & Series', '7%', 1),
          createChapter('m5', 'Differentiation/AOD', '7%', 1),
          createChapter('m6', 'Vectors', '7%', 1),
          createChapter('m7', 'Matrices & Determinants', '7%', 1),
          createChapter('m8', 'Straight Lines', '6%', 2),
          createChapter('m9', 'Circles', '6%', 2),
          createChapter('m10', 'Conics', '8%', 2),
          createChapter('m11', 'Quadratic', '4%', 2),
          createChapter('m12', 'P&C/Binomial', '4%', 2),
          createChapter('m13', 'Complex Nos', '3%', 3),
          createChapter('m14', 'Probability', '3%', 3),
          createChapter('m15', 'Statistics', '3%', 3),
          createChapter('m16', 'Basics/Trigonometry', '4%', 3),
        ])
      }
    ]
  },
  {
    id: 'bitsat',
    name: 'Birla Institute of Technology and Science Admission Test (BITSAT)',
    shortName: 'BITSAT',
    targetDate: '2026-04-15T09:00:00Z',
    overallProgress: 0,
    priority: 2,
    goals: [],
    milestones: [
      { id: 'b1', text: 'BITSAT Mock 1', date: '2026-04-05T00:00:00Z', type: 'mock-test' },
      { id: 'b2', text: 'BITSAT Mock 2', date: '2026-04-10T00:00:00Z', type: 'mock-test' },
      { id: 'b3', text: 'BITSAT Exam', date: '2026-04-15T09:00:00Z', type: 'exam' },
    ],
    subjects: [
      {
        id: 'phy',
        name: 'Physics',
        progress: 0,
        chapters: sortChapters([
          createChapter('p1', 'Magnetic Effects of Current', '6.23%', 1),
          createChapter('p2', 'Current Electricity', '5.47%', 1),
          createChapter('p3', 'Newtons Laws of Motion', '4.75%', 1),
          createChapter('p4', 'Electrostatics and Capacitance', '4.75%', 1),
          createChapter('p5', 'Thermodynamics', '4.59%', 1),
          createChapter('p6', 'Simple Harmonic Motion', '4.59%', 1),
          createChapter('p7', 'Waves (Sound and String)', '4.59%', 1),
          createChapter('p8', 'Ray Optics', '4.43%', 1),
          createChapter('p9', 'Fluid Mechanics', '4.26%', 2),
          createChapter('p10', 'Rotational Motion', '4.1%', 2),
          createChapter('p11', 'Modern Physics', '4.1%', 2),
          createChapter('p12', 'Semiconductors', '4.1%', 2),
          createChapter('p13', 'Kinematics (Motion in a Plane)', '3.84%', 2),
          createChapter('p14', 'Gravitation', '3.65%', 2),
          createChapter('p15', 'Wave Optics', '3.61%', 2),
          createChapter('p16', 'Electromagnetic Induction', '3.44%', 2),
          createChapter('p17', 'Capacitance', '2.79%', 3),
          createChapter('p18', 'Alternating Current', '2.79%', 3),
          createChapter('p19', 'Kinematics (Motion in a line)', '2.62%', 3),
          createChapter('p20', 'Mechanical Properties of Solids', '2.62%', 3),
          createChapter('p21', 'Thermal Properties of Matter', '2.62%', 3),
          createChapter('p22', 'Nuclear Physics', '2.62%', 3),
          createChapter('p23', 'Kinetic Theory of Gases', '2.46%', 3),
          createChapter('p24', 'Units and Dimensions', '2.3%', 4),
          createChapter('p25', 'Work Power Energy', '2.13%', 4),
          createChapter('p26', 'Center of Mass', '2.13%', 4),
          createChapter('p27', 'Electromagnetic Waves', '2.0%', 4),
        ])
      },
      {
        id: 'chem',
        name: 'Chemistry',
        progress: 0,
        chapters: sortChapters([
          createChapter('c1', 'Chemical Bonding', '10%', 1),
          createChapter('c2', 'Equilibrium', '7%', 1),
          createChapter('c3', 'Atomic Structure', '6%', 1),
          createChapter('c4', 'Mole Concept', '6%', 1),
          createChapter('c5', 'p-block', '6%', 1),
          createChapter('c6', 'Carbonyls', '6%', 1),
          createChapter('c7', 'Biomolecules/Polymers', '6%', 1),
          createChapter('c8', 'Thermodynamics', '5%', 2),
          createChapter('c9', 'Electrochemistry', '5%', 2),
          createChapter('c10', 'Alcohols', '5%', 2),
          createChapter('c11', 'Hydrocarbons', '5%', 2),
          createChapter('c12', 's-block', '4%', 2),
          createChapter('c13', 'Solid State', '4%', 2),
          createChapter('c14', 'd/f block', '4%', 2),
          createChapter('c15', 'Amines', '4%', 2),
          createChapter('c16', 'Solutions', '4%', 3),
          createChapter('c17', 'Kinetics', '3%', 3),
          createChapter('c18', 'Periodicity', '3%', 3),
          createChapter('c19', 'GOC', '4%', 3),
        ])
      },
      {
        id: 'math',
        name: 'Mathematics',
        progress: 0,
        chapters: sortChapters([
          createChapter('m1', 'Circles', '11%', 1),
          createChapter('m2', 'Straight Lines', '7%', 1),
          createChapter('m3', 'Conics', '7%', 1),
          createChapter('m4', 'Vectors', '6%', 1),
          createChapter('m5', '3D Geometry', '6%', 1),
          createChapter('m6', 'Differential Calculus', '6%', 1),
          createChapter('m7', 'Trigonometry', '6%', 2),
          createChapter('m8', 'Integral Calculus', '5%', 2),
          createChapter('m9', 'Probability & Stats', '5%', 2),
          createChapter('m10', 'Quadratic', '4%', 2),
          createChapter('m11', 'Seq/Series', '4%', 2),
          createChapter('m12', 'P&C/Binomial', '4%', 2),
          createChapter('m13', 'Diff Equations', '4%', 3),
          createChapter('m14', 'Complex Nos', '4%', 3),
          createChapter('m15', 'AOD', '3%', 3),
          createChapter('m16', 'Matrices & Determinants', '3%', 4),
        ])
      },
      {
        id: 'eng_lr',
        name: 'English & LR',
        progress: 0,
        chapters: sortChapters([
          createChapter('el1', 'Figure Matrix/Formation', '40%', 1),
          createChapter('el2', 'Synonyms/Antonyms', '30%', 1),
          createChapter('el3', 'Series/Analogy', '20%', 1),
          createChapter('el4', 'Sentence Completion', '15%', 2),
          createChapter('el5', 'Jumbled Words', '15%', 2),
          createChapter('el6', 'Grammar', '10%', 2),
          createChapter('el7', 'Logical Deduction', '10%', 2),
          createChapter('el8', 'Paper Folding', '7%', 3),
        ])
      }
    ]
  },
  {
    id: 'comedk',
    name: 'Consortium of Medical, Engineering and Dental Colleges of Karnataka (COMEDK)',
    shortName: 'COMEDK',
    targetDate: '2026-05-10T09:00:00Z',
    overallProgress: 0,
    priority: 3,
    goals: [],
    subjects: [
      {
        id: 'phy',
        name: 'Physics',
        progress: 0,
        chapters: sortChapters([
          createChapter('p1', 'Electrostatics', '10%', 1),
          createChapter('p2', 'Current Electricity', '10%', 1),
          createChapter('p3', 'Thermodynamics', '8%', 1),
          createChapter('p4', 'Kinematics', '5%', 1),
          createChapter('p5', 'Rotational Motion', '5%', 1),
          createChapter('p6', 'Gravitation', '5%', 1),
          createChapter('p7', 'Ray Optics', '5%', 1),
          createChapter('p8', 'Laws of Motion', '4%', 2),
          createChapter('p9', 'Work/Energy', '4%', 2),
          createChapter('p10', 'KTG', '4%', 2),
          createChapter('p11', 'Atoms/Nuclei', '4%', 2),
          createChapter('p12', 'Magnetic Effects', '4%', 2),
          createChapter('p13', 'Magnetism/Matter', '3%', 3),
          createChapter('p14', 'EMI', '3%', 3),
          createChapter('p15', 'Dual Nature', '3%', 3),
          createChapter('p16', 'Semiconductors', '3%', 3),
          createChapter('p17', 'Wave Optics', '3%', 3),
          createChapter('p18', 'AC', '2%', 4),
          createChapter('p19', 'Units/Measurement', '2%', 4),
          createChapter('p20', 'EM Waves', '1%', 4),
        ])
      },
      {
        id: 'chem',
        name: 'Chemistry',
        progress: 0,
        chapters: sortChapters([
          createChapter('c1', 'Aldehydes/Ketones', '8%', 1),
          createChapter('c2', 'p-block', '7%', 1),
          createChapter('c3', 'GOC', '6%', 1),
          createChapter('c4', 'Coordination Compounds', '6%', 1),
          createChapter('c5', 'Haloalkanes/Arenes', '6%', 1),
          createChapter('c6', 'Alcohols/Phenols', '6%', 1),
          createChapter('c7', 'Nitrogen Compounds', '6%', 1),
          createChapter('c8', 'Chemical Bonding', '5%', 1),
          createChapter('c9', 'd/f block', '5%', 2),
          createChapter('c10', 'Solutions', '4%', 2),
          createChapter('c11', 'Electrochemistry', '4%', 2),
          createChapter('c12', 'Kinetics', '4%', 2),
          createChapter('c13', 'Thermodynamics', '4%', 2),
          createChapter('c14', 'Hydrocarbons', '4%', 2),
          createChapter('c15', 'Biomolecules/Polymers', '4%', 3),
          createChapter('c16', 'Mole Concept', '3%', 3),
          createChapter('c17', 'Atomic Structure', '3%', 3),
          createChapter('c18', 'Surface Chem', '3%', 3),
          createChapter('c19', 'States of Matter', '2%', 4),
          createChapter('c20', 'Periodicity', '2%', 4),
          createChapter('c21', 's-block', '2%', 4),
          createChapter('c22', 'Hydrogen', '1%', 4),
        ])
      },
      {
        id: 'math',
        name: 'Mathematics',
        progress: 0,
        chapters: sortChapters([
          createChapter('m1', 'Differentiation/AOD', '10%', 1),
          createChapter('m2', '3D Geometry', '8%', 1),
          createChapter('m3', 'Matrices & Determinants', '8%', 1),
          createChapter('m4', 'Integration', '7%', 1),
          createChapter('m5', 'Vector Algebra', '7%', 1),
          createChapter('m6', 'Limits/Continuity', '5%', 2),
          createChapter('m7', 'Straight Lines', '4%', 2),
          createChapter('m8', 'Circles', '4%', 2),
          createChapter('m9', 'Conic Sections', '4%', 2),
          createChapter('m10', 'Complex Numbers', '4%', 2),
          createChapter('m11', 'Probability', '8%', 2),
          createChapter('m12', 'Quadratic Equations', '3%', 3),
          createChapter('m13', 'Sequence/Series', '3%', 3),
          createChapter('m14', 'P&C', '3%', 3),
          createChapter('m15', 'Binomial Theorem', '3%', 3),
          createChapter('m16', 'Diff Equations', '3%', 3),
          createChapter('m17', 'Sets/Relations', '3%', 4),
          createChapter('m18', 'Stats', '2%', 4),
          createChapter('m19', 'Mathematical Induction', '1%', 4),
        ])
      }
    ]
  },
  {
    id: 'eamcet',
    name: 'Telangana State Engineering, Agriculture and Medical Common Entrance Test (TS EAMCET)',
    shortName: 'TS EAMCET',
    targetDate: '2026-05-09T09:00:00Z',
    overallProgress: 0,
    priority: 4,
    goals: [],
    subjects: [
      {
        id: 'math',
        name: 'Mathematics',
        progress: 0,
        chapters: sortChapters([
          createChapter('m1', 'Calculus (Integration & Differentiation)', '22 Qs', 1),
          createChapter('m2', 'Algebra (Functions, Matrices, Probability)', '14 Qs', 1),
          createChapter('m3', 'Vectors & 3D', '10 Qs', 1),
          createChapter('m4', 'Coordinate Geo (Circles & Straight Lines)', '9 Qs', 1),
          createChapter('m5', 'Trigonometry', '9 Qs', 2),
          createChapter('m6', 'P&C & Binomial', '6 Qs', 3),
          createChapter('m7', 'Complex Numbers', '4 Qs', 3),
        ])
      },
      {
        id: 'phy',
        name: 'Physics',
        progress: 0,
        chapters: sortChapters([
          createChapter('p1', 'Mechanics (Rotational, NLM, WEP)', '12 Qs', 1),
          createChapter('p2', 'Electrodynamics (Current & Magnetism)', '10 Qs', 1),
          createChapter('p3', 'Thermodynamics', '6 Qs', 1),
          createChapter('p4', 'Modern Physics', '5 Qs', 2),
          createChapter('p5', 'Optics & Waves', '4 Qs', 2),
          createChapter('p6', 'Gravitation', '3 Qs', 3),
        ])
      },
      {
        id: 'chem',
        name: 'Chemistry',
        progress: 0,
        chapters: sortChapters([
          createChapter('c1', 'Organic (Hydrocarbons & Carbonyls)', '10 Qs', 1),
          createChapter('c2', 'Inorganic (p-Block & Chemical Bonding)', '9 Qs', 1),
          createChapter('c3', 'Physical (Atomic Structure & Solutions)', '7 Qs', 1),
          createChapter('c4', 'Biomolecules & Polymers', '5 Qs', 2),
          createChapter('c5', 'd & f Block', '3 Qs', 2),
          createChapter('c6', 'Electrochemistry', '2 Qs', 3),
          createChapter('c7', 'Kinetics', '2 Qs', 3),
        ])
      }
    ]
  },
  {
    id: 'cuet',
    name: 'Common University Entrance Test (CUET-UG)',
    shortName: 'CUET',
    targetDate: '2026-05-11T09:00:00Z',
    overallProgress: 0,
    priority: 5,
    goals: [],
    subjects: [
      {
        id: 'phy',
        name: 'Physics',
        progress: 0,
        chapters: sortChapters([
          createChapter('p1', 'Electrostatics', '8 Qs', 1),
          createChapter('p2', 'Magnetic Effects', '8 Qs', 1),
          createChapter('p3', 'Optics', '8 Qs', 1),
          createChapter('p4', 'Current Electricity', '7 Qs', 1),
          createChapter('p5', 'EMI & AC', '6 Qs', 2),
          createChapter('p6', 'Dual Nature', '5 Qs', 2),
          createChapter('p7', 'Atoms & Nuclei', '4 Qs', 2),
          createChapter('p8', 'Electronic Devices', '3 Qs', 3),
          createChapter('p9', 'EM Waves', '1 Qs', 4),
        ])
      },
      {
        id: 'chem',
        name: 'Chemistry',
        progress: 0,
        chapters: sortChapters([
          createChapter('c1', 'Haloalkanes', '6 Qs', 1),
          createChapter('c2', 'Coordination Compounds', '5-6 Qs', 1),
          createChapter('c3', 'd & f Block', '5 Qs', 1),
          createChapter('c4', 'Electrochemistry & Solutions', '5 Qs', 1),
          createChapter('c5', 'Biomolecules', '5 Qs', 1),
          createChapter('c6', 'Alcohols/Phenols', '4-5 Qs', 2),
          createChapter('c7', 'Aldehydes/Ketones', '4 Qs', 2),
          createChapter('c8', 'Amines', '4 Qs', 2),
          createChapter('c9', 'Chemical Kinetics', '3 Qs', 3),
        ])
      },
      {
        id: 'math',
        name: 'Mathematics',
        progress: 0,
        chapters: sortChapters([
          createChapter('m1', 'Calculus (Integrals & Derivatives)', '20-25 Qs', 1),
          createChapter('m2', 'Vectors & 3D Geometry', '10-15 Qs', 1),
          createChapter('m3', 'Probability', '5-7 Qs', 2),
          createChapter('m4', 'Matrices & Determinants', '4-6 Qs', 2),
          createChapter('m5', 'Linear Programming', '2-4 Qs', 3),
        ])
      }
    ]
  },
  {
    id: 'neet',
    name: 'National Eligibility cum Entrance Test (NEET-UG)',
    shortName: 'NEET',
    targetDate: '2026-05-03T09:00:00Z',
    overallProgress: 0,
    priority: 1,
    goals: [],
    milestones: [
      { id: 'n1', text: 'Biology Revision', date: '2026-04-20T00:00:00Z', type: 'revision' },
      { id: 'n2', text: 'NEET Mock Test', date: '2026-04-25T00:00:00Z', type: 'mock-test' },
      { id: 'n3', text: 'NEET Exam', date: '2026-05-03T09:00:00Z', type: 'exam' },
    ],
    subjects: [
      {
        id: 'phy',
        name: 'Physics',
        progress: 0,
        chapters: sortChapters([
          createChapter('np1', 'Kinematics', '5%', 1),
          createChapter('np2', 'Laws of Motion', '5%', 1),
          createChapter('np3', 'Work, Energy & Power', '5%', 1),
          createChapter('np4', 'Rotational Motion', '6%', 1),
          createChapter('np5', 'Gravitation', '4%', 1),
          createChapter('np6', 'Fluid Mechanics', '5%', 1),
          createChapter('np7', 'Units & Measurement', '5%', 1),
          createChapter('np8', 'KTG', '4%', 1),
          createChapter('np9', 'Laws of Thermodynamics', '6%', 1),
          createChapter('np10', 'Electrostatics', '10%', 1),
          createChapter('np11', 'Current Electricity', '10%', 1),
          createChapter('np12', 'Magnetism', '5%', 1),
          createChapter('np13', 'Ray Optics', '8%', 1),
          createChapter('np14', 'Wave Optics', '7%', 1),
          createChapter('np15', 'Dual Nature', '4%', 1),
          createChapter('np16', 'Atoms & Nuclei', '5%', 1),
          createChapter('np17', 'Semiconductors', '3%', 1),
          createChapter('np18', 'EM Waves', '3%', 1),
          createChapter('np19', 'SHM', '4%', 2),
          createChapter('np20', 'Doppler Effect', '4%', 2),
          createChapter('np21', 'Electronics (Logic Gates)', '5%', 2),
        ])
      },
      {
        id: 'chem',
        name: 'Chemistry',
        progress: 0,
        chapters: sortChapters([
          createChapter('nc1', 'Mole Concept', '4%', 1),
          createChapter('nc2', 'Atomic Structure', '4%', 1),
          createChapter('nc3', 'Chemical Bonding', '6%', 1),
          createChapter('nc4', 'Solutions', '5%', 1),
          createChapter('nc5', 'Electrochemistry', '5%', 1),
          createChapter('nc6', 'Chemical Kinetics', '5%', 1),
          createChapter('nc7', 'p-Block Elements', '7%', 1),
          createChapter('nc8', 'Coordination Compounds', '8%', 1),
          createChapter('nc9', 'GOC', '6%', 1),
          createChapter('nc10', 'Hydrocarbons', '4%', 1),
          createChapter('nc11', 'Haloalkanes', '6%', 1),
          createChapter('nc12', 'Alcohols & Phenols', '6%', 1),
          createChapter('nc13', 'Aldehydes & Ketones', '8%', 1),
          createChapter('nc14', 'Nitrogen Compounds', '6%', 1),
          createChapter('nc15', 'Biomolecules', '4%', 1),
          createChapter('nc16', 'Thermodynamics', '4%', 2),
          createChapter('nc17', 'States of Matter', '3%', 2),
          createChapter('nc18', 'Periodicity', '4%', 2),
          createChapter('nc19', 'Surface Chemistry', '5%', 2),
          createChapter('nc20', 'd and f Block', '5%', 2),
        ])
      },
      {
        id: 'botany',
        name: 'Botany',
        progress: 0,
        chapters: sortChapters([
          createChapter('nb1', 'Photosynthesis', '8%', 1),
          createChapter('nb2', 'Respiration in Plants', '5%', 1),
          createChapter('nb3', 'Plant Growth & Development', '4%', 1),
          createChapter('nb4', 'Sexual Reproduction in Plants', '10%', 1),
          createChapter('nb5', 'Mendelian Inheritance', '10%', 1),
          createChapter('nb6', 'DNA Replication', '5%', 1),
          createChapter('nb7', 'Gene Expression', '5%', 1),
          createChapter('nb8', 'Recombinant DNA Tech', '5%', 1),
          createChapter('nb9', 'Gene Therapy', '5%', 1),
          createChapter('nb10', 'Ecosystems', '5%', 1),
          createChapter('nb11', 'Biodiversity', '5%', 1),
          createChapter('nb12', 'Morphology of Flowering Plants', '5%', 2),
          createChapter('nb13', 'Roots & Stems', '5%', 2),
          createChapter('nb14', 'Transpiration', '3%', 2),
        ])
      },
      {
        id: 'zoology',
        name: 'Zoology',
        progress: 0,
        chapters: sortChapters([
          createChapter('nz1', 'Digestion & Absorption', '5%', 1),
          createChapter('nz2', 'Respiration (Human)', '5%', 1),
          createChapter('nz3', 'Circulation', '5%', 1),
          createChapter('nz4', 'Excretion', '5%', 1),
          createChapter('nz5', 'Nervous System', '5%', 1),
          createChapter('nz6', 'Gametogenesis', '5%', 1),
          createChapter('nz7', 'Embryonic Development', '5%', 1),
          createChapter('nz8', 'Reproductive Health', '10%', 1),
          createChapter('nz9', 'Immunology', '10%', 1),
          createChapter('nz10', 'Evolution', '10%', 1),
          createChapter('nz11', 'Animal Kingdom Classification', '5%', 2),
          createChapter('nz12', 'Phylum Study', '5%', 2),
          createChapter('nz13', 'Origin of Life', '5%', 2),
          createChapter('nz14', 'Human Evolution', '5%', 2),
        ])
      }
    ]
  }
];

export const mockNotifications = [];
