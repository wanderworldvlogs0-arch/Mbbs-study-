import { db, pool, subjectsTable, chaptersTable, mcqsTable } from "./index";

// Matches artifacts/mockup-sandbox's Subjects.tsx SUBJECTS array exactly.
const SUBJECTS = [
  { id: "anatomy", name: "Anatomy", chapterCount: 32, mcqCount: 450, videoCount: 85, theme: "preclinical", icon: "Bone" },
  { id: "physiology", name: "Physiology", chapterCount: 28, mcqCount: 380, videoCount: 72, theme: "preclinical", icon: "Activity" },
  { id: "biochemistry", name: "Biochemistry", chapterCount: 24, mcqCount: 290, videoCount: 60, theme: "preclinical", icon: "FlaskConical" },
  { id: "pathology", name: "Pathology", chapterCount: 30, mcqCount: 420, videoCount: 90, theme: "paraclinical", icon: "Microscope" },
  { id: "pharmacology", name: "Pharmacology", chapterCount: 35, mcqCount: 510, videoCount: 110, theme: "paraclinical", icon: "Pill" },
  { id: "microbiology", name: "Microbiology", chapterCount: 26, mcqCount: 310, videoCount: 65, theme: "paraclinical", icon: "Bug" },
  { id: "forensic", name: "Forensic Medicine", chapterCount: 18, mcqCount: 180, videoCount: 40, theme: "paraclinical", icon: "Scale" },
  { id: "community", name: "Community Medicine", chapterCount: 22, mcqCount: 260, videoCount: 55, theme: "paraclinical", icon: "Users" },
  { id: "ent", name: "ENT", chapterCount: 16, mcqCount: 200, videoCount: 45, theme: "clinical", icon: "Ear" },
  { id: "ophthalmology", name: "Ophthalmology", chapterCount: 14, mcqCount: 175, videoCount: 38, theme: "clinical", icon: "Eye" },
  { id: "medicine", name: "General Medicine", chapterCount: 40, mcqCount: 620, videoCount: 140, theme: "clinical", icon: "Stethoscope" },
  { id: "surgery", name: "General Surgery", chapterCount: 38, mcqCount: 580, videoCount: 125, theme: "clinical", icon: "Scissors" },
  { id: "pediatrics", name: "Pediatrics", chapterCount: 28, mcqCount: 350, videoCount: 80, theme: "clinical", icon: "Baby" },
  { id: "obgyn", name: "Obstetrics & Gynecology", chapterCount: 32, mcqCount: 400, videoCount: 95, theme: "clinical", icon: "Users" },
  { id: "orthopedics", name: "Orthopedics", chapterCount: 20, mcqCount: 240, videoCount: 50, theme: "clinical", icon: "Bone" },
  { id: "dermatology", name: "Dermatology", chapterCount: 18, mcqCount: 220, videoCount: 45, theme: "clinical", icon: "Scan" },
  { id: "psychiatry", name: "Psychiatry", chapterCount: 16, mcqCount: 190, videoCount: 35, theme: "clinical", icon: "Brain" },
  { id: "radiology", name: "Radiology", chapterCount: 14, mcqCount: 160, videoCount: 30, theme: "clinical", icon: "Radio" },
  { id: "anesthesiology", name: "Anesthesiology", chapterCount: 12, mcqCount: 140, videoCount: 25, theme: "clinical", icon: "Syringe" },
] as const;

// Only Anatomy has real chapter rows for now — the rest of the catalog's
// chapter breakdown is content-authoring work, not a coding task. Add more
// subjects' chapters here the same way as that content is written.
const ANATOMY_CHAPTERS = [
  { title: "Osteology", subChapterCount: 4, estimatedMinutes: 150 },
  { title: "Arthrology", subChapterCount: 3, estimatedMinutes: 105 },
  { title: "Myology", subChapterCount: 5, estimatedMinutes: 195 },
  { title: "Cardiovascular System", subChapterCount: 6, estimatedMinutes: 240 },
  { title: "Lymphatics", subChapterCount: 2, estimatedMinutes: 75 },
  { title: "Neurology", subChapterCount: 8, estimatedMinutes: 330 },
  { title: "Head & Neck", subChapterCount: 12, estimatedMinutes: 480 },
  { title: "Thorax", subChapterCount: 5, estimatedMinutes: 225 },
  { title: "Abdomen", subChapterCount: 9, estimatedMinutes: 380 },
  { title: "Pelvis", subChapterCount: 4, estimatedMinutes: 170 },
];
// Sample MCQs for Anatomy only, to exercise the quiz engine end-to-end.
// Add more subjects' questions here the same way — this is content-authoring
// work, not a coding task.
const ANATOMY_MCQS = [
  {
    questionText: "Which bone is commonly known as the collarbone?",
    options: [
      { id: "A", text: "Scapula" },
      { id: "B", text: "Clavicle" },
      { id: "C", text: "Humerus" },
      { id: "D", text: "Sternum" },
    ],
    correctOptionId: "B",
    explanation: "The clavicle (collarbone) connects the arm to the trunk of the body.",
  },
  {
    questionText: "The femur is located in which part of the body?",
    options: [
      { id: "A", text: "Forearm" },
      { id: "B", text: "Lower leg" },
      { id: "C", text: "Thigh" },
      { id: "D", text: "Foot" },
    ],
    correctOptionId: "C",
    explanation: "The femur is the thigh bone and the longest bone in the human body.",
  },
  {
    questionText: "Which chamber of the heart receives oxygenated blood from the lungs?",
    options: [
      { id: "A", text: "Right atrium" },
      { id: "B", text: "Right ventricle" },
      { id: "C", text: "Left atrium" },
      { id: "D", text: "Left ventricle" },
    ],
    correctOptionId: "C",
    explanation: "The left atrium receives oxygenated blood via the pulmonary veins.",
  },
  {
    questionText: "How many pairs of cranial nerves are there?",
    options: [
      { id: "A", text: "10" },
      { id: "B", text: "12" },
      { id: "C", text: "14" },
      { id: "D", text: "31" },
    ],
    correctOptionId: "B",
    explanation: "There are 12 pairs of cranial nerves arising directly from the brain.",
  },
  {
    questionText: "Which joint type is the shoulder joint classified as?",
    options: [
      { id: "A", text: "Hinge joint" },
      { id: "B", text: "Pivot joint" },
      { id: "C", text: "Ball and socket joint" },
      { id: "D", text: "Saddle joint" },
    ],
    correctOptionId: "C",
    explanation: "The shoulder is a ball and socket joint, allowing a wide range of motion.",
  },
  {
    questionText: "The diaphragm primarily separates which two body cavities?",
    options: [
      { id: "A", text: "Thoracic and abdominal" },
      { id: "B", text: "Abdominal and pelvic" },
      { id: "C", text: "Cranial and thoracic" },
      { id: "D", text: "Thoracic and pelvic" },
    ],
    correctOptionId: "A",
    explanation: "The diaphragm separates the thoracic cavity from the abdominal cavity.",
  },
  {
    questionText: "Which muscle is the primary muscle used for breathing?",
    options: [
      { id: "A", text: "Deltoid" },
      { id: "B", text: "Diaphragm" },
      { id: "C", text: "Trapezius" },
      { id: "D", text: "Rectus abdominis" },
    ],
    correctOptionId: "B",
    explanation: "The diaphragm contracts and relaxes to drive normal breathing.",
  },
  {
    questionText: "The largest lymphatic vessel in the body is the:",
    options: [
      { id: "A", text: "Thoracic duct" },
      { id: "B", text: "Right lymphatic duct" },
      { id: "C", text: "Cisterna chyli" },
      { id: "D", text: "Subclavian vein" },
    ],
    correctOptionId: "A",
    explanation: "The thoracic duct is the largest lymphatic vessel, draining most of the body.",
  },
  {
    questionText: "Which part of the vertebral column has 7 vertebrae?",
    options: [
      { id: "A", text: "Thoracic" },
      { id: "B", text: "Lumbar" },
      { id: "C", text: "Cervical" },
      { id: "D", text: "Sacral" },
    ],
    correctOptionId: "C",
    explanation: "The cervical spine consists of 7 vertebrae (C1–C7).",
  },
  {
    questionText: "The kidneys are located in which region of the abdomen?",
    options: [
      { id: "A", text: "Anterior abdominal wall" },
      { id: "B", text: "Retroperitoneal space" },
      { id: "C", text: "Pelvic cavity" },
      { id: "D", text: "Peritoneal cavity" },
    ],
    correctOptionId: "B",
    explanation: "The kidneys lie behind the peritoneum, in the retroperitoneal space.",
  },
];
async function seed() {
  console.log("Seeding subjects...");
  await db
    .insert(subjectsTable)
    .values(SUBJECTS.map((s) => ({ ...s })))
    .onConflictDoNothing();

  console.log("Seeding Anatomy chapters...");
  await db
    .insert(chaptersTable)
    .values(
      ANATOMY_CHAPTERS.map((c, i) => ({
        subjectId: "anatomy",
        title: c.title,
        orderIndex: i,
        subChapterCount: c.subChapterCount,
        estimatedMinutes: c.estimatedMinutes,
      })),
    )
    .onConflictDoNothing();
console.log("Seeding Anatomy MCQs...");
  await db
    .insert(mcqsTable)
    .values(
      ANATOMY_MCQS.map((q, i) => ({
        subjectId: "anatomy",
        questionText: q.questionText,
        options: q.options,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
        orderIndex: i,
      })),
    )
    .onConflictDoNothing();
  console.log("Done.");
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
