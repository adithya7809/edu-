import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';
import { Exam } from '../types';

interface PerformanceProps {
  exams: Exam[];
}

export function Performance({ exams }: PerformanceProps) {
  const data = exams.map(exam => ({
    name: exam.shortName,
    progress: exam.overallProgress || 0,
  }));

  const stats = [
    { label: 'Total Exams', value: exams.length, icon: Target, color: 'text-brand-primary' },
    { label: 'Avg. Mastery', value: `${Math.round(exams.reduce((acc, curr) => acc + (curr.overallProgress || 0), 0) / (exams.length || 1))}%`, icon: Award, color: 'text-brand-primary' },
    { label: 'Active Goals', value: exams.reduce((acc, curr) => acc + (curr.goals?.filter(g => !g.completed).length || 0), 0), icon: Zap, color: 'text-brand-primary' },
    { label: 'Top Performer', value: exams.sort((a, b) => (b.overallProgress || 0) - (a.overallProgress || 0))[0]?.shortName || 'N/A', icon: TrendingUp, color: 'text-brand-primary' },
  ];

  const isPremium = document.documentElement.getAttribute('data-theme') === 'premium';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-brand-surface border border-white/10 rounded-[32px] p-8 shadow-2xl"
          >
            <div className={`w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-3xl font-serif font-bold text-white tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-brand-surface border border-white/10 rounded-[40px] p-8 sm:p-12 shadow-2xl">
        <div className="mb-12">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">EXAM MASTERY ANALYSIS</h3>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-2">Comparative progress across all active certifications</p>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#ffffff40" 
                fontSize={10} 
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
                dy={15}
              />
              <YAxis 
                stroke="#ffffff40" 
                fontSize={10} 
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--color-brand-surface)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '20px',
                  padding: '12px 20px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}
                itemStyle={{ color: 'var(--color-brand-primary)', fontWeight: 'bold', fontSize: '12px' }}
                labelStyle={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', fontFamily: 'Libre Baskerville' }}
              />
              <Bar dataKey="progress" radius={[10, 10, 0, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="var(--color-brand-primary)" fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {exams.map((exam, i) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="bg-brand-surface border border-white/10 rounded-[32px] p-8"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-1 block">{exam.shortName}</span>
                <h4 className="text-xl font-serif font-bold text-white leading-none">{exam.name}</h4>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-3">Detailed Breakdown</p>
              </div>
              <span className="text-2xl font-bold text-brand-primary">{exam.overallProgress}%</span>
            </div>
            
            <div className="space-y-6">
              {exam.subjects.map(subject => (
                <div key={subject.id}>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span className="text-white/60">{subject.name}</span>
                    <span className="text-brand-primary">{subject.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="h-full bg-brand-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
