import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/lib/types';

// Placeholder projects data
const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Weekend Project 1',
    description:
      'This is a placeholder for your first weekend project. Update this with your actual project details, including description, technologies used, and links.',
    status: 'coming-soon',
    technologies: ['React', 'TypeScript'],
  },
  {
    id: 'project-2',
    title: 'Weekend Project 2',
    description:
      'Another placeholder project. Replace with your actual weekend projects as you complete them.',
    status: 'coming-soon',
    technologies: ['Python', 'Data Analysis'],
  },
  {
    id: 'project-3',
    title: 'Weekend Project 3',
    description:
      'Add more projects here to showcase your personal work and interests outside of research.',
    status: 'coming-soon',
  },
];

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Weekend Projects
        </h1>
        <p className="text-gray-600">
          Personal projects and experiments I work on in my spare time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <p className="text-gray-600 text-sm">
          <strong>Note:</strong> These are placeholder projects. Update the
          projects array in <code className="bg-white px-2 py-1 rounded">app/projects/page.tsx</code> to
          add your actual projects.
        </p>
      </div>
    </div>
  );
}

