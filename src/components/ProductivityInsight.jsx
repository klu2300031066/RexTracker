import React from 'react';
import { Sparkles, Brain } from 'lucide-react';
import useProductivityAI from '../hooks/useProductivityAI';
import './ProductivityInsight.css';

const ProductivityInsight = () => {
    const { recommendation, score, isTraining } = useProductivityAI();

    return (
        <div className="productivity-insight">
            <div className="insight-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Brain size={16} /> AI Insight
                </span>
                <span className="ai-badge">Beta</span>
            </div>

            <div className="insight-content">
                {isTraining ? (
                    <div className="training-loader">
                        <div className="pulse-dot"></div>
                        Training on your data...
                    </div>
                ) : (
                    <>
                        <div className="insight-rec">{recommendation}</div>
                        <div className="insight-bar-container">
                            <div
                                className="insight-bar"
                                style={{ width: `${score * 100}%` }}
                            ></div>
                        </div>
                        <div className="insight-score">
                            Probability: {(score * 100).toFixed(0)}%
                        </div>
                    </>
                )}
            </div>

            {/* Background decoration */}
            <Sparkles
                style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    opacity: 0.05,
                    color: 'white'
                }}
                size={100}
            />
        </div>
    );
};

export default ProductivityInsight;
