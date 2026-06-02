import Image from 'next/image';
import { GraduationCap, Users, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold tracking-tight">About SkillVane IT Academy</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          We are dedicated to making GCP Data Engineering accessible to everyone through expert-led live courses and hands-on projects.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-muted">
          <Image
            src="https://cdn.abacus.ai/images/c378bcbe-598f-4646-a183-0cc88bbd54a8.png"
            alt="SkillVane IT Academy modern learning environment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold tracking-tight">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            SkillVane IT Academy was founded with a simple goal: to bridge the gap between aspiring data engineers and the cloud industry. 
            We believe in practical, project-based learning that prepares students for real-world challenges.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our GCP Data Engineering program covers BigQuery, Dataflow, Dataproc, Cloud Composer, and more, 
            ensuring students are job-ready within 3 months.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <GraduationCap className="w-6 h-6" />, title: 'Expert Instructors', desc: 'Learn from experienced GCP professionals' },
          { icon: <Users className="w-6 h-6" />, title: 'Small Batches', desc: 'Personalized attention in every class' },
          { icon: <Target className="w-6 h-6" />, title: 'Job Focused', desc: 'Curriculum designed for industry needs' },
          { icon: <Heart className="w-6 h-6" />, title: 'Student Support', desc: '24/7 doubt resolution and mentoring' },
        ].map((item: any, i: number) => (
          <div key={i} className="bg-muted/30 rounded-xl p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto">
              {item?.icon}
            </div>
            <h3 className="font-display font-semibold">{item?.title ?? ''}</h3>
            <p className="text-sm text-muted-foreground">{item?.desc ?? ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
