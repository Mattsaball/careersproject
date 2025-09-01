/**
 * An interface representing a student's career journey and advice.
 * @property {string} major The student's major.
 * @property {string} career_filter The student's career filter.
 * @property {string} major_filter The student's major filter.
 * @property {string} networking_strats The student's networking strategies.
 * @property {string} hacks The student's hacks and shortcuts.
 * @property {string} additional_advice The student's additional advice.
 * @property {number} class The student's class year.
 * @property {string} academic_year The student's academic year.
 */
export interface CareerCard {
    major: string;
    career_filter: string;
    major_filter: string;
    networking_strats: string;
    hacks: string;
    additional_advice: string;
    class_year: string; // Changed from 'class' (reserved keyword) and made consistent type
    grad_year: number;
    advice: string;
}

// Interface that creates the properties for the student card not in career card
export interface StudentCardProps extends CareerCard {
    soph_summer: string;
    fresh_summer: string;
    soph_career_type: string;
    fresh_career_type: string;
    soph_how_got: string;
    fresh_how_got: string;
}

// Class that holds all student card properties
export class StudentCard implements StudentCardProps {
    // Use definite assignment assertion for all properties
    major!: string;
    career_filter!: string;
    major_filter!: string;
    networking_strats!: string;
    hacks!: string;
    additional_advice!: string;
    class_year!: string;
    grad_year!: number;
    advice!: string;
    soph_summer!: string;
    fresh_summer!: string;
    soph_career_type!: string;
    fresh_career_type!: string;
    soph_how_got!: string;
    fresh_how_got!: string;

    constructor(props: StudentCardProps) {
        Object.assign(this, props);
    }
}

export interface AlumniCardProps extends CareerCard {
    post_grad_plans: string;
    skills_to_focus_on: string;
    prev_experience: string;

}

export class AlumniCard implements AlumniCardProps {
    major!: string;
    career_filter!: string;
    major_filter!: string;
    networking_strats!: string;
    hacks!: string;
    additional_advice!: string;
    class_year!: string;
    grad_year!: number;
    advice!: string;
    post_grad_plans!: string;
    skills_to_focus_on!: string;
    prev_experience!: string;

    constructor(props: AlumniCardProps) {
        Object.assign(this, props);
    }
}
// Example usage:
const exampleStudent = new StudentCard({
    major: "Computer Science",
    career_filter: "Tech",
    major_filter: "STEM",
    networking_strats: "LinkedIn, career fairs",
    hacks: "Side projects, internships",
    additional_advice: "Build a portfolio",
    class_year: "Junior",
    grad_year: 2026,
    advice: "Explore different fields",
    soph_summer: "Software engineering internship",
    fresh_summer: "Worked at startup",
    soph_career_type: "Full-time tech role",
    fresh_career_type: "Internship",
    soph_how_got: "Through networking",
    fresh_how_got: "Cold applications"
});

const exampleAlumni = new AlumniCard({
    major: "Computer Science",
    career_filter: "Tech",
    major_filter: "STEM",
    networking_strats: "LinkedIn, career fairs",
    hacks: "Side projects, internships",
    additional_advice: "Build a portfolio",
    class_year: "Junior",
    grad_year: 2026,
    advice: "Explore different fields",
    post_grad_plans: "Start a startup",
    skills_to_focus_on: "Software engineering",
    prev_experience: "Worked at startup"
});

console.log(exampleStudent);
console.log(exampleAlumni);


