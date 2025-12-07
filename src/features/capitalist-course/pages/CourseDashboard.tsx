import { courseData } from '../data/courseContent';
import { Link } from 'react-router-dom';
import { CheckCircle, Lock, PlayCircle, Clock, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CourseDashboard() {
    const [completedSessions, setCompletedSessions] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('completedSessions');
        if (saved) {
            try {
                setCompletedSessions(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse completedSessions", e);
            }
        }
    }, []);

    return (
        <div className="space-y-12">
            <div className="text-center max-w-4xl mx-auto space-y-6">
                <h2 className="text-5xl font-bold text-gray-100 tracking-tight font-serif">Your Journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Capitalist Freedom</span></h2>
                <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                    Discard the laborer's mindset. Ascend the hierarchy. Master the art of let your capital work for you.
                </p>
                <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gold-500/80 font-medium tracking-wider uppercase">
                    <div className="flex items-center gap-2"><Clock size={16} /> 5 Sessions</div>
                    <div className="flex items-center gap-2"><Award size={16} /> Certificates Available</div>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {courseData.map((session, index) => {
                    const isCompleted = completedSessions.includes(session.id);
                    const previousSessionId = index > 0 ? courseData[index - 1].id : null;
                    const isLocked = previousSessionId ? !completedSessions.includes(previousSessionId) : false;

                    return (
                        <div key={session.id} className={`group relative flex flex-col bg-dark-800 rounded-sm shadow-md border border-dark-700 overflow-hidden transition-all duration-500 ${isLocked ? 'opacity-60 grayscale' : 'hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:border-gold-500/30 hover:-translate-y-1'}`}>
                            <div className={`h-1 w-full ${isCompleted ? 'bg-green-500' : isLocked ? 'bg-dark-700' : 'bg-gold-500'}`}></div>

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="inline-flex items-center px-3 py-1 rounded-sm text-[10px] font-bold bg-dark-900 border border-dark-600 text-gray-400 uppercase tracking-widest">
                                        Session {index + 1}
                                    </span>
                                    {isCompleted ? (
                                        <div className="text-green-500">
                                            <CheckCircle size={24} />
                                        </div>
                                    ) : isLocked ? (
                                        <div className="text-dark-600">
                                            <Lock size={24} />
                                        </div>
                                    ) : (
                                        <div className="text-gold-500 group-hover:text-gold-400 transition-colors">
                                            <PlayCircle size={24} />
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-2xl font-bold text-gray-100 mb-4 leading-tight font-serif group-hover:text-gold-400 transition-colors">
                                    {session.title.split('：')[1] || session.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-1">
                                    {session.description}
                                </p>

                                <div className="mt-auto">
                                    {isLocked ? (
                                        <button disabled className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-dark-900/50 border border-dark-700 text-dark-500 rounded-sm cursor-not-allowed font-medium text-xs tracking-wider uppercase">
                                            <Lock size={14} /> Locked
                                        </button>
                                    ) : (
                                        <Link
                                            to={`/course/capitalist/session/${session.id}`}
                                            className={`w-full flex items-center justify-center gap-2 py-4 px-4 rounded-sm font-bold text-xs tracking-widest uppercase transition-all ${isCompleted
                                                ? 'bg-transparent border border-green-500/50 text-green-500 hover:bg-green-500/10'
                                                : 'bg-gradient-to-br from-gold-500 to-gold-600 text-dark-900 hover:to-gold-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                                                }`}
                                        >
                                            {isCompleted ? 'Review Session' : 'Start Learning'}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
