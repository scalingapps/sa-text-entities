import { 
	EntitiesInfo,
	SaTextEntities 
} from './SaTextEntities'
const saTextEntities = new SaTextEntities()

const text: string = `Want to get better at interviews from both sides of the table? 
(interview & interviewer's perspective)
this is a #hashatg and #another

@JemYoung
 shares his lessons learned going through interviews, and hiring people 
 at Netflix in his new course, Interviewing for 
 Front-End Engineers! https://frontendmasters.com/courses/interviewing-frontend/

 https://frontendmasters.com/courses/image.jpg
`

saTextEntities.extractEntities(text)
	.then((entities: EntitiesInfo) => {
		console.log(entities)
	})
