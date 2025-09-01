import { StudentCard, AlumniCard, StudentCardProps, AlumniCardProps } from './objects/career_card';

// Import JSON data (ensure resolveJsonModule is enabled in tsconfig.json)
import alumniData from './DataTruth/alumnireflects(cleaned).json';
import sophData from './DataTruth/sophreflects(cleaned).json';

// Mapping function for sophData JSON to StudentCardProps
function mapSophJsonToStudentCardProps(entry: any): StudentCardProps {
    return {
        major: entry["What is your major(s)?\n(Separate with commas if more than one)"] || "",
        career_filter: entry["CareerFilter"] || "",
        major_filter: entry["MajorFilter"] || "",
        networking_strats: entry["What specific networking strategies have actually worked for you?\nCold emailing? Coffee chats? LinkedIn? Tell us what got real results.  "] || "",
        hacks: entry["Hacks and shortcuts "] || "",
        additional_advice: entry["Is there anything else you’d like to share that this survey didn’t cover (advice, reflections, or insights)?"] || "",
        class_year: entry["Class"] || "",
        grad_year: typeof entry["Grad Year"] === "string" ? parseInt(entry["Grad Year"]) : entry["Grad Year"],
        advice: entry["If you could talk to your freshman or sophomore self, what would you tell them to focus on to get to where you are now (or where you're headed)? "] || "",
        soph_summer: entry["What are you doing professionally this summer?\n(e.g., Business Analyst at Capital One)"] || "",
        fresh_summer: entry["What did you do professionally last summer (going into sophomore year)?\n(e.g., Research Assistant at Columbia SIPA)"] || "",
        soph_career_type: entry["CareerFilter"] || "",
        fresh_career_type: entry["Career Type Fresh summer "] || "",
        soph_how_got: entry["How last summer"] || "",
        fresh_how_got: entry["How did you get that experience?\nWhen did you apply? Was it part of a program, a referral, or something else? Did you interview? We'd love to hear the whole story."] || "",
    };
}

// Mapping function for alumniData JSON to AlumniCardProps
function mapAlumniJsonToAlumniCardProps(entry: any): AlumniCardProps {
    return {
        major: entry["What is your major(s)?\n(Separate with commas if more than one)"] || "",
        career_filter: entry["CareerFilter"] || "",
        major_filter: entry["MajorFilter"] || "",
        networking_strats: entry["What specific networking strategies have actually worked for you?\nCold emailing? Coffee chats? LinkedIn? Tell us what got real results.  "] || "",
        hacks: entry["Hacks and shortcuts "] || "",
        additional_advice: entry["Is there anything else you’d like to share that this survey didn’t cover (advice, reflections, or insights)?"] || "",
        class_year: entry["Class"] || "",
        grad_year: typeof entry["Grad Year"] === "string" ? parseInt(entry["Grad Year"]) : entry["Grad Year"],
        advice: entry["If you could talk to your freshman or sophomore self, what would you tell them to focus on to get to where you are now (or where you're headed)? "] || "",
        post_grad_plans: entry["What are your post-graduation plans?\n(e.g., Full-time at Google, Grad School at MIT, etc.)"] || "",
        skills_to_focus_on: entry["What skills do you wish you had focused on more in college to prepare for your current role?"] || "",
        prev_experience: entry["What previous experiences (internships, research, etc.) best prepared you for your current role?"] || "",
    };
}

// Populate arrays of card instances
const alumniCards: AlumniCard[] = (alumniData as any[]).map(
    (item) => new AlumniCard(mapAlumniJsonToAlumniCardProps(item))
);

const studentCards: StudentCard[] = (sophData as any[]).map(
    (item) => new StudentCard(mapSophJsonToStudentCardProps(item))
);

// Example: log the first card from each array
console.log(alumniCards[0]);
console.log(studentCards[0]);
console.log(alumniCards); // Print all alumni cards

export { alumniCards, studentCards };
