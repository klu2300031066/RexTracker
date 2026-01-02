import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const useProductivityAI = () => {
    const [recommendation, setRecommendation] = useState("Analyzing...");
    const [score, setScore] = useState(0);
    const [isTraining, setIsTraining] = useState(true);

    useEffect(() => {
        const trainAndPredict = async () => {
            try {
                // 1. Data Preparation
                const sessions = JSON.parse(localStorage.getItem('rex_study_sessions') || '[]');
                const tasks = JSON.parse(localStorage.getItem('rex_tasks') || '[]');

                // We want to map Hour of Day (0-23) -> Productive (1) or Not (0)
                // Let's build a frequency map of activity
                const hourlyActivity = new Array(24).fill(0);

                sessions.forEach(s => {
                    const hour = new Date(s.date).getHours();
                    hourlyActivity[hour] += (s.duration || 25) / 25; // Weighted by duration
                });

                tasks.forEach(t => {
                    if (t.completedAt) {
                        const hour = new Date(t.completedAt).getHours();
                        hourlyActivity[hour] += 1;
                    }
                });

                // Normalize activity to 0-1 range to create labels
                const maxActivity = Math.max(...hourlyActivity, 1);
                const labels = hourlyActivity.map(count => count > 0 ? count / maxActivity : 0);

                // Create training tensors
                // Input: Hour of day (normalized 0-1)
                const inputs = tf.tensor2d(
                    Array.from({ length: 24 }, (_, i) => [i / 23])
                );

                // Output: Normalized activity score
                const outputs = tf.tensor2d(labels, [24, 1]);

                // 2. Model Architecture
                const model = tf.sequential();
                model.add(tf.layers.dense({ units: 8, inputShape: [1], activation: 'relu' }));
                model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
                model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

                model.compile({
                    optimizer: tf.train.adam(0.1),
                    loss: 'meanSquaredError'
                });

                // 3. Train
                await model.fit(inputs, outputs, {
                    epochs: 50,
                    shuffle: true,
                    verbose: 0
                });

                // 4. Predict for CURRENT hour
                const currentHour = new Date().getHours();
                const prediction = model.predict(tf.tensor2d([[currentHour / 23]]));
                const predictedScore = prediction.dataSync()[0];

                setScore(predictedScore);

                // 5. Generate Insight
                if (predictedScore > 0.7) {
                    setRecommendation("High Focus Zone 🧠");
                } else if (predictedScore > 0.4) {
                    setRecommendation("Good for Light Tasks ⚡");
                } else {
                    setRecommendation("Recharge & Plan 💤");
                }

                // Cleanup
                inputs.dispose();
                outputs.dispose();
                prediction.dispose();
                // We don't dispose the model immediately if we wanted to reuse, but here we run once per mount
                // model.dispose(); 

            } catch (err) {
                console.error("AI Training Failed:", err);
                setRecommendation("AI Offline");
            } finally {
                setIsTraining(false);
            }
        };

        // Delay slightly to let page load
        const timer = setTimeout(trainAndPredict, 1000);
        return () => clearTimeout(timer);
    }, []);

    return { recommendation, score, isTraining };
};

export default useProductivityAI;
