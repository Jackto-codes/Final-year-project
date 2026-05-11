export interface TriageAnswers {
  pain_level?: number;
  duration_days?: number;
  has_vomiting?: boolean;
  has_fever?: boolean;
  has_fainting?: boolean;
}

export interface TriageData {
  symptoms: string[];
  answers: TriageAnswers;
}

export function calculateScore(data: TriageData): number {
  let score = 0;
  const { symptoms, answers } = data;
  const normalizedSymptoms = symptoms.map((s) => s.toLowerCase().trim());

  // Answers scoring
  if (answers.pain_level !== undefined && answers.pain_level >= 7) {
    score += 4;
  }
  if (answers.duration_days !== undefined && answers.duration_days > 3) {
    score += 2;
  }

  // Check both explicit answers and AI-extracted symptoms
  const hasVomiting = answers.has_vomiting || normalizedSymptoms.includes("vomiting");
  const hasFever = answers.has_fever || normalizedSymptoms.includes("fever");
  const hasFainting = answers.has_fainting || normalizedSymptoms.includes("fainting");

  if (hasVomiting) {
    score += 3;
  }
  if (hasFever) {
    score += 3;
  }
  if (hasFainting) {
    score += 10;
  }

  // Symptoms scoring
  if (normalizedSymptoms.includes("dizziness")) {
    score += 2;
  }
  if (
    normalizedSymptoms.includes("stomach_pain") ||
    normalizedSymptoms.includes("stomach pain")
  ) {
    score += 2;
  }
  if (normalizedSymptoms.includes("cough")) {
    score += 1;
  }

  return score;
}

export type Severity = "EMERGENCY" | "URGENT" | "MODERATE" | "MILD";
export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
export type Action = "SELF_CARE" | "BOOK_SHUTTLE" | "PRIORITY_BOOKING" | "EMERGENCY_DISPATCH";

export function classifyRisk(symptoms: string[]): RiskLevel {
  const normalized = symptoms.map(s => s.toLowerCase().trim());
  const highRisk = ["fainting", "food_poisoning", "fracture", "appendicitis", "severe_infection"];
  const mediumRisk = ["malaria", "typhoid", "vomiting", "diarrhea", "severe_menstrual_pain"];
  
  if (normalized.some(s => highRisk.includes(s))) {
    return "HIGH";
  }
  if (normalized.some(s => mediumRisk.includes(s))) {
    return "MEDIUM";
  }
  return "LOW";
}

export function getAction(severity: Severity): Action {
  switch (severity) {
    case "MILD": return "SELF_CARE";
    case "MODERATE": return "BOOK_SHUTTLE";
    case "URGENT": return "PRIORITY_BOOKING";
    case "EMERGENCY": return "EMERGENCY_DISPATCH";
  }
}

export function getSeverity(score: number, risk: RiskLevel, answers: TriageAnswers, symptoms: string[]): Severity {
  const normalized = symptoms.map(s => s.toLowerCase().trim());
  
  if (
    answers.has_fainting === true ||
    normalized.includes("fracture") ||
    (normalized.includes("food_poisoning") && normalized.includes("vomiting")) ||
    normalized.includes("fainting")
  ) {
    return "EMERGENCY";
  }

  const painLevel = answers.pain_level || 0;
  if (risk === "HIGH" && painLevel >= 6) {
    return "EMERGENCY";
  }

  if (risk === "MEDIUM") {
    if (painLevel >= 6 || normalized.length > 1) {
      return "URGENT";
    }
    return "MODERATE";
  }

  if (risk === "LOW") {
    if (painLevel >= 6) {
      return "MODERATE";
    }
    // Only fall through if score needs to be considered, otherwise return MILD
  }

  // Fallback to score
  if (score >= 15) return "EMERGENCY";
  if (score >= 9) return "URGENT";
  if (score >= 5) return "MODERATE";
  return "MILD";
}
