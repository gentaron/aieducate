import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Download, BookOpen, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { courseData } from '../data/courseContent';
import type { Slide } from '../data/courseContent';

export default function SessionPage() {
    const { sessionId } = useParams();
    const session = courseData.find(s => s.id === sessionId);
    const certificateRef = useRef<HTMLDivElement>(null);
    const [generatingPdf, setGeneratingPdf] = useState(false);

    // Flatten slides for linear navigation
    const allSlides: { sectionStart?: boolean; sectionTitle?: string; slide: Slide; sectionId: string }[] = [];
    session?.sections.forEach(section => {
        section.slides.forEach((slide, index) => {
            allSlides.push({
                sectionStart: index === 0,
                sectionTitle: section.title,
                slide,
                sectionId: section.id
            });
        });
    });

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [completed, setCompleted] = useState(false);

    if (!session) return <div className="p-10 text-gold-500">Session not found</div>;

    const currentSlideData = allSlides[currentSlideIndex];
    const progress = ((currentSlideIndex + 1) / allSlides.length) * 100;

    const handleNext = () => {
        if (currentSlideIndex < allSlides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            setCompleted(true);
            // Save completion
            const completedSessions = JSON.parse(localStorage.getItem('completedSessions') || '[]');
            if (!completedSessions.includes(session.id)) {
                completedSessions.push(session.id);
                localStorage.setItem('completedSessions', JSON.stringify(completedSessions));
            }
        }
    };

    const handlePrev = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleDownloadCertificate = async () => {
        if (!certificateRef.current) return;
        setGeneratingPdf(true);
        try {
            // Wait a moment for rendering if needed
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // High resolution
                backgroundColor: null,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Certificate-${session.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
        } catch (err) {
            console.error(err);
        } finally {
            setGeneratingPdf(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header / Progress */}
            <div className="mb-8">
                <Link to="/course/capitalist" className="text-gray-500 hover:text-gold-500 flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest transition-colors">
                    <ArrowLeft size={16} /> Course Dashboard
                </Link>
                <div className="flex justify-between items-end mb-3">
                    <h2 className="text-xl font-bold text-gray-100 font-serif tracking-wide">{session.title}</h2>
                    <span className="text-xs font-bold text-gold-500 tracking-widest">{Math.round(progress)}% COMPLETED</span>
                </div>
                <div className="w-full bg-dark-800 rounded-full h-1">
                    <div className="bg-gold-500 h-1 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.5)]" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <AnimatePresence mode='wait'>
                {!completed ? (
                    <motion.div
                        key={currentSlideIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-dark-800 rounded-sm shadow-2xl border border-dark-700 overflow-hidden min-h-[500px] flex flex-col"
                    >
                        {/* Section Header */}
                        <div className="bg-dark-900/50 px-8 py-4 border-b border-dark-700 flex items-center gap-3">
                            <BookOpen size={18} className="text-gold-500" />
                            <span className="text-xs font-bold text-gold-500/80 uppercase tracking-widest">{currentSlideData.sectionTitle}</span>
                        </div>

                        <div className="p-8 md:p-12 flex-1">
                            <h3 className="text-3xl font-bold text-gray-100 mb-8 font-serif">{currentSlideData.slide.title}</h3>
                            <div className="prose prose-invert prose-gold max-w-none text-lg leading-relaxed text-gray-300">
                                <ReactMarkdown>
                                    {currentSlideData.slide.content}
                                </ReactMarkdown>
                            </div>
                        </div>

                        <div className="p-6 bg-dark-900/30 border-t border-dark-700 flex justify-between items-center">
                            <button
                                onClick={handlePrev}
                                disabled={currentSlideIndex === 0}
                                className="px-6 py-3 rounded-sm text-gray-500 font-bold text-xs uppercase tracking-widest disabled:opacity-30 hover:text-gold-500 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 rounded-sm font-bold shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-0.5 text-xs uppercase tracking-widest"
                            >
                                {currentSlideIndex === allSlides.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-800 rounded-sm shadow-2xl border border-gold-500/20 p-12 text-center"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                            <CheckCircle size={48} className="text-dark-900" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4 font-serif">Session Completed</h2>
                        <p className="text-xl text-gray-400 mb-10 font-light">
                            You have cleared "{session.title}".<br />Your capitalist transformation continues.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={handleDownloadCertificate}
                                disabled={generatingPdf}
                                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 rounded-sm font-bold shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all transform hover:-translate-y-1 text-sm uppercase tracking-widest"
                            >
                                {generatingPdf ? 'Generating...' : <><Download size={20} /> Collect Certificate</>}
                            </button>
                            <Link
                                to="/course/capitalist"
                                className="px-8 py-4 bg-dark-900 border border-dark-600 text-gray-400 rounded-sm font-bold hover:text-white hover:border-gray-400 transition-colors text-sm uppercase tracking-widest"
                            >
                                Return
                            </Link>
                        </div>

                        {/* Hidden Certificate Template for Capture */}
                        <div className="absolute left-[-9999px] top-[-9999px]">
                            <div ref={certificateRef} className="w-[1123px] h-[794px] bg-dark-900 relative flex flex-col items-center justify-center text-center p-20 border-[20px] border-double border-gold-500">
                                {/* Watermark/BG */}
                                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500 via-transparent to-transparent"></div>

                                <div className="mb-10 text-gold-500">
                                    <GraduationCap size={100} />
                                </div>

                                <h1 className="text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-gold-600 mb-8 uppercase tracking-widest drop-shadow-sm">Certificate</h1>
                                <p className="text-2xl text-gray-400 tracking-[0.2em] uppercase mb-12">of Capitalist Ascension</p>

                                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-12"></div>

                                <p className="text-3xl text-gray-300 font-light italic mb-8">This certifies that the aspiring capitalist</p>
                                <p className="text-6xl font-serif text-white mb-12 drop-shadow-md">Master Capitalist</p>
                                <p className="text-3xl text-gray-300 font-light italic mb-6">has successfully mastered the principles of</p>
                                <p className="text-4xl font-bold text-gold-400 mb-16 max-w-4xl mx-auto leading-tight">{session.title}</p>

                                <div className="flex justify-between w-full px-20 mt-10">
                                    <div className="flex flex-col gap-2 items-center">
                                        <div className="w-64 h-[1px] bg-gray-500"></div>
                                        <p className="text-xl text-gray-500 uppercase tracking-widest">Date</p>
                                        <p className="text-2xl text-white font-serif">{new Date().toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 items-center">
                                        <div className="w-64 h-[1px] bg-gray-500"></div>
                                        <p className="text-xl text-gray-500 uppercase tracking-widest">Signature</p>
                                        <p className="text-2xl text-gold-500 font-serif italic">Gen5W</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
