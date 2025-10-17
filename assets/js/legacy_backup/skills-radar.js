/**
 * Skills Radar Chart Component
 * Features: Chart.js implementation with animation on view
 */

class SkillsRadarChart {
    constructor() {
        this.chart = null;
        this.canvas = null;
        this.observer = null;
        this.isChartVisible = false;
        this.init();
    }

    init() {
        this.loadChartJS().then(() => {
            this.createRadarChart();
            this.setupIntersectionObserver();
        });
    }

    async loadChartJS() {
        return new Promise((resolve) => {
            if (window.Chart) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    createRadarChart() {
        // Find the skills section and create radar chart container
        const skillsSection = document.querySelector('#skills .skills-container');
        if (!skillsSection) {
            console.error('Skills section not found');
            return;
        }

        // Create radar chart container
        const radarContainer = document.createElement('div');
        radarContainer.className = 'skills-radar-container';
        radarContainer.innerHTML = `
            <div class="radar-chart-wrapper">
                <h3 class="radar-chart-title">Skills Overview</h3>
                <div class="radar-chart-canvas-container">
                    <canvas id="skillsRadarChart"></canvas>
                </div>
                <div class="radar-legend">
                    <div class="legend-item">
                        <span class="legend-color legend-technical"></span>
                        <span>Technical Skills</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color legend-soft"></span>
                        <span>Soft Skills</span>
                    </div>
                </div>
            </div>
        `;

        // Insert radar chart before skills container
        skillsSection.parentNode.insertBefore(radarContainer, skillsSection);

        this.canvas = document.getElementById('skillsRadarChart');
        if (!this.canvas) {
            console.error('Canvas element not created');
            return;
        }

        console.log('Canvas created successfully');
        this.setupChart();
    }

    setupChart() {
        const ctx = this.canvas.getContext('2d');

        // Skill data extracted from the existing skills section
        const skillsData = this.extractSkillsData();

        // Debug: Check if we have both technical and soft skills
        console.log('Chart Data:', skillsData);

        this.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: skillsData.labels,
                datasets: [
                    {
                        label: 'Technical Skills',
                        data: skillsData.technical,
                        backgroundColor: 'rgba(100, 255, 218, 0.15)',
                        borderColor: 'rgba(100, 255, 218, 1)',
                        borderWidth: 3,
                        pointBackgroundColor: 'rgba(100, 255, 218, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(100, 255, 218, 1)',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        fill: true,
                        tension: 0.1
                    },
                    {
                        label: 'Soft Skills',
                        data: skillsData.soft,
                        backgroundColor: 'rgba(177, 74, 237, 0.15)',
                        borderColor: 'rgba(177, 74, 237, 1)',
                        borderWidth: 3,
                        pointBackgroundColor: 'rgba(177, 74, 237, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(177, 74, 237, 1)',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        fill: true,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0, // We'll handle animation manually
                },
                plugins: {
                    legend: {
                        display: false, // We'll use custom legend
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 34, 64, 0.95)',
                        titleColor: '#64ffda',
                        bodyColor: '#ccd6f6',
                        borderColor: '#64ffda',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        bodyFont: {
                            family: 'Poppins',
                            size: 13
                        },
                        titleFont: {
                            family: 'Poppins',
                            size: 14,
                            weight: 'bold'
                        },
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.r;
                                if (value > 0) {
                                    return `${context.dataset.label}: ${value}%`;
                                }
                                return null; // Don't show if value is 0
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        min: 0,
                        ticks: {
                            stepSize: 20,
                            color: '#8892b0',
                            backdropColor: 'transparent',
                            font: {
                                size: 12,
                                family: 'Roboto Mono'
                            },
                            showLabelBackdrop: false
                        },
                        grid: {
                            color: 'rgba(136, 146, 176, 0.3)',
                            circular: true,
                            lineWidth: 1
                        },
                        angleLines: {
                            color: 'rgba(136, 146, 176, 0.3)',
                            lineWidth: 1
                        },
                        pointLabels: {
                            color: '#ccd6f6',
                            font: {
                                size: 13,
                                family: 'Poppins',
                                weight: '500'
                            },
                            padding: 10
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'point'
                },
                elements: {
                    line: {
                        borderWidth: 3
                    },
                    point: {
                        radius: 6,
                        hoverRadius: 8
                    }
                }
            }
        });
    }

    extractSkillsData() {
        // Extract skills from the existing skills section
        const skillCategories = document.querySelectorAll('.skill-category');
        const labels = [];
        const technical = [];
        const soft = [];

        skillCategories.forEach(category => {
            const categoryTitle = category.querySelector('h3')?.textContent?.toLowerCase() || '';
            const skills = category.querySelectorAll('.skill-item');
            
            skills.forEach(skill => {
                const name = skill.querySelector('.skill-name')?.textContent?.trim() || '';
                const percentageText = skill.querySelector('.skill-percentage')?.textContent || '0%';
                const percentage = parseInt(percentageText.replace('%', '')) || 0;
                
                if (name && percentage > 0) {
                    labels.push(name);
                    
                    // Check if this is a soft skills category
                    if (categoryTitle.includes('soft')) {
                        soft.push(percentage);
                        technical.push(0);
                    } else {
                        technical.push(percentage);
                        soft.push(0);
                    }
                }
            });
        });

        // Ensure we have a good mix for the radar - limit to top skills
        const maxSkills = 10;
        const limitedLabels = labels.slice(0, maxSkills);
        const limitedTechnical = technical.slice(0, maxSkills);
        const limitedSoft = soft.slice(0, maxSkills);

        console.log('Extracted Skills Data:', {
            labels: limitedLabels,
            technical: limitedTechnical,
            soft: limitedSoft
        });

        return {
            labels: limitedLabels,
            technical: limitedTechnical,
            soft: limitedSoft
        };
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isChartVisible) {
                    this.animateChart();
                    this.isChartVisible = true;
                }
            });
        }, observerOptions);

        const chartContainer = document.querySelector('.skills-radar-container');
        if (chartContainer) {
            this.observer.observe(chartContainer);
        }
    }

    animateChart() {
        if (!this.chart) return;

        // Store original data
        const originalData = this.chart.data.datasets.map(dataset => [...dataset.data]);
        
        // Set data to 0 for animation start
        this.chart.data.datasets.forEach(dataset => {
            dataset.data = dataset.data.map(() => 0);
        });
        this.chart.update('none');

        // Animate to original values
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        let currentStep = 0;

        const animateStep = () => {
            currentStep++;
            const progress = Math.min(currentStep / steps, 1);
            const easeProgress = this.easeOutCubic(progress);

            this.chart.data.datasets.forEach((dataset, datasetIndex) => {
                dataset.data = originalData[datasetIndex].map(value => 
                    Math.round(value * easeProgress)
                );
            });

            this.chart.update('none');

            if (progress < 1) {
                setTimeout(animateStep, stepDuration);
            } else {
                // Add final glow effect
                this.addGlowEffect();
            }
        };

        // Start animation with a delay for better effect
        setTimeout(animateStep, 300);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    addGlowEffect() {
        const container = document.querySelector('.radar-chart-canvas-container');
        if (container) {
            container.classList.add('chart-glow');
            setTimeout(() => {
                container.classList.remove('chart-glow');
            }, 1000);
        }
    }

    updateChart(newData) {
        if (!this.chart) return;

        this.chart.data.datasets[0].data = newData.technical;
        this.chart.data.datasets[1].data = newData.soft;
        this.chart.update();
    }
}

// CSS Styles for Radar Chart
const radarChartStyles = `
/* Skills Radar Chart Styles */
.skills-radar-container {
    margin-bottom: 3rem;
    display: flex;
    justify-content: center;
}

.radar-chart-wrapper {
    background: var(--secondary);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(100, 255, 218, 0.1);
    max-width: 600px;
    width: 100%;
    transition: all 0.3s ease;
}

.radar-chart-wrapper:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(100, 255, 218, 0.3);
}

.radar-chart-title {
    text-align: center;
    color: var(--accent);
    font-size: 1.5rem;
    margin-bottom: 2rem;
    position: relative;
}

.radar-chart-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: var(--accent);
}

.radar-chart-canvas-container {
    position: relative;
    height: 400px;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
}

.radar-chart-canvas-container.chart-glow {
    filter: drop-shadow(0 0 20px rgba(100, 255, 218, 0.5));
}

#skillsRadarChart {
    width: 100% !important;
    height: 100% !important;
}

.radar-legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.legend-color {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: block;
}

.legend-technical {
    background: rgba(100, 255, 218, 1);
    box-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
}

.legend-soft {
    background: rgba(177, 74, 237, 1);
    box-shadow: 0 0 10px rgba(177, 74, 237, 0.5);
}

/* Skill Enhancement Animations */
.skill-category.enhanced {
    transform: scale(1.02);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
}

.skill-item.highlighted {
    background: rgba(100, 255, 218, 0.1);
    border-radius: 8px;
    padding: 0.5rem;
    margin: 0.25rem 0;
    transition: all 0.3s ease;
}

/* Interactive radar points */
.radar-chart-canvas-container::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: var(--accent);
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(100, 255, 218, 0.8);
    animation: radar-pulse 2s infinite;
    z-index: 1;
    pointer-events: none;
}

@keyframes radar-pulse {
    0%, 100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    50% {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0.5;
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .radar-chart-wrapper {
        padding: 1rem;
        margin: 0 1rem;
    }
    
    .radar-chart-canvas-container {
        height: 300px;
    }
    
    .radar-legend {
        gap: 1rem;
    }
    
    .legend-item {
        font-size: 0.8rem;
    }
}

@media (max-width: 480px) {
    .radar-chart-canvas-container {
        height: 250px;
    }
    
    .radar-chart-title {
        font-size: 1.2rem;
    }
}

/* Loading animation for chart */
.radar-chart-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    color: var(--text-secondary);
}

.radar-chart-loading::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid var(--secondary);
    border-top: 4px solid var(--accent);
    border-radius: 50%;
    animation: radar-loading-spin 1s linear infinite;
    margin-left: 1rem;
}

@keyframes radar-loading-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Skill Highlighting Feature
class SkillHighlighter {
    constructor(radarChart) {
        this.radarChart = radarChart;
        this.setupSkillInteraction();
    }

    setupSkillInteraction() {
        const skillItems = document.querySelectorAll('.skill-item');
        const canvas = document.getElementById('skillsRadarChart');
        
        if (!canvas || !this.radarChart.chart) {
            console.log('Canvas or chart not found for skill interaction');
            return;
        }

        console.log(`Setting up interaction for ${skillItems.length} skill items`);

        skillItems.forEach((item, index) => {
            const skillName = item.querySelector('.skill-name')?.textContent?.trim();
            
            item.addEventListener('mouseenter', () => {
                if (skillName) {
                    this.highlightSkillByName(skillName);
                    item.classList.add('highlighted');
                }
            });

            item.addEventListener('mouseleave', () => {
                this.resetHighlight();
                item.classList.remove('highlighted');
            });
        });
    }

    highlightSkillByName(skillName) {
        if (!this.radarChart.chart) return;

        const chart = this.radarChart.chart;
        const labels = chart.data.labels;
        const skillIndex = labels.findIndex(label => 
            label.toLowerCase().includes(skillName.toLowerCase()) || 
            skillName.toLowerCase().includes(label.toLowerCase())
        );

        if (skillIndex !== -1) {
            this.highlightSkill(skillIndex);
        }
    }

    highlightSkill(skillIndex) {
        if (!this.radarChart.chart) return;

        // Temporarily reduce opacity of other points
        this.radarChart.chart.data.datasets.forEach(dataset => {
            const originalRadius = dataset.pointRadius;
            dataset.pointRadius = dataset.pointRadius.map((radius, index) => 
                index === skillIndex ? 10 : 4
            );
        });

        this.radarChart.chart.update('none');
    }

    resetHighlight() {
        if (!this.radarChart.chart) return;

        // Reset all points to normal size
        this.radarChart.chart.data.datasets.forEach(dataset => {
            dataset.pointRadius = 6;
        });

        this.radarChart.chart.update('none');
    }
}

// Initialize Skills Radar Chart
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing Skills Radar Chart');
    
    // Add styles to document
    if (!document.getElementById('radar-chart-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'radar-chart-styles';
        styleSheet.textContent = radarChartStyles;
        document.head.appendChild(styleSheet);
        console.log('Radar chart styles added');
    }
    
    // Initialize radar chart with delay to ensure DOM is ready
    setTimeout(() => {
        console.log('Starting radar chart initialization');
        try {
            const radarChart = new SkillsRadarChart();
            
            // Initialize skill highlighter after chart is created
            setTimeout(() => {
                console.log('Initializing skill highlighter');
                new SkillHighlighter(radarChart);
            }, 2000); // Increased delay to ensure chart is fully loaded
        } catch (error) {
            console.error('Error initializing radar chart:', error);
        }
    }, 1000); // Increased initial delay
});
