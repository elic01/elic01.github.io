#!/usr/bin/env python3
"""
Website Baseline Analyzer
Analyzes current website structure, assets, and provides technical metrics
for the UI refresh baseline audit.
"""

import os
import re
import json
from pathlib import Path
from urllib.parse import urlparse
from collections import defaultdict

def analyze_html_file(file_path):
    """Analyze HTML file structure and extract metrics."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    metrics = {
        'file_size': os.path.getsize(file_path),
        'line_count': len(content.splitlines()),
        'char_count': len(content),
        'external_resources': [],
        'images': [],
        'scripts': [],
        'stylesheets': [],
        'meta_tags': [],
        'accessibility_features': {
            'alt_text_count': 0,
            'aria_labels': 0,
            'semantic_elements': 0,
            'form_labels': 0
        }
    }
    
    # Extract external resources
    link_pattern = r'<link[^>]+href=["\']([^"\']+)["\'][^>]*>'
    script_pattern = r'<script[^>]+src=["\']([^"\']+)["\'][^>]*>'
    img_pattern = r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>'
    
    for match in re.finditer(link_pattern, content):
        href = match.group(1)
        if href.startswith('http'):
            metrics['external_resources'].append(href)
        metrics['stylesheets'].append(href)
    
    for match in re.finditer(script_pattern, content):
        src = match.group(1)
        if src.startswith('http'):
            metrics['external_resources'].append(src)
        metrics['scripts'].append(src)
    
    for match in re.finditer(img_pattern, content):
        src = match.group(1)
        metrics['images'].append(src)
    
    # Extract meta tags
    meta_pattern = r'<meta[^>]+>'
    metrics['meta_tags'] = re.findall(meta_pattern, content)
    
    # Accessibility analysis
    metrics['accessibility_features']['alt_text_count'] = len(re.findall(r'alt=["\'][^"\']*["\']', content))
    metrics['accessibility_features']['aria_labels'] = len(re.findall(r'aria-[a-zA-Z-]+=["\'][^"\']*["\']', content))
    metrics['accessibility_features']['semantic_elements'] = len(re.findall(r'<(header|nav|main|section|article|aside|footer)', content))
    metrics['accessibility_features']['form_labels'] = len(re.findall(r'<label[^>]*>', content))
    
    return metrics

def analyze_assets_directory():
    """Analyze assets directory structure and file sizes."""
    assets_info = {
        'total_size': 0,
        'file_types': defaultdict(list),
        'structure': {}
    }
    
    assets_path = Path('./assets')
    if not assets_path.exists():
        return assets_info
    
    for file_path in assets_path.rglob('*'):
        if file_path.is_file():
            size = file_path.stat().st_size
            assets_info['total_size'] += size
            
            file_type = file_path.suffix.lower()
            relative_path = str(file_path.relative_to('.'))
            
            assets_info['file_types'][file_type].append({
                'path': relative_path,
                'size': size,
                'size_kb': round(size / 1024, 2)
            })
    
    return assets_info

def generate_performance_report(html_metrics, assets_info):
    """Generate performance analysis report."""
    report = {
        'html_analysis': {
            'file_size_kb': round(html_metrics['file_size'] / 1024, 2),
            'line_count': html_metrics['line_count'],
            'external_dependencies': len(html_metrics['external_resources']),
            'local_scripts': len([s for s in html_metrics['scripts'] if not s.startswith('http')]),
            'local_stylesheets': len([s for s in html_metrics['stylesheets'] if not s.startswith('http')]),
            'total_images': len(html_metrics['images'])
        },
        'assets_analysis': {
            'total_size_kb': round(assets_info['total_size'] / 1024, 2),
            'css_files': len(assets_info['file_types'].get('.css', [])),
            'js_files': len(assets_info['file_types'].get('.js', [])),
            'image_files': len(assets_info['file_types'].get('.jpg', []) + 
                              assets_info['file_types'].get('.jpeg', []) + 
                              assets_info['file_types'].get('.png', []) + 
                              assets_info['file_types'].get('.gif', []))
        },
        'external_dependencies': html_metrics['external_resources'],
        'optimization_opportunities': []
    }
    
    # Add optimization recommendations
    if len(html_metrics['external_resources']) > 3:
        report['optimization_opportunities'].append("Consider reducing external dependencies")
    
    if report['assets_analysis']['total_size_kb'] > 1000:
        report['optimization_opportunities'].append("Assets directory is large, consider optimization")
    
    if len(html_metrics['scripts']) > 5:
        report['optimization_opportunities'].append("Many script files - consider bundling")
    
    return report

def main():
    """Main analysis function."""
    print("🔍 Website Baseline Analyzer")
    print("=" * 50)
    
    # Analyze main HTML file
    html_file = Path('./index.html')
    if html_file.exists():
        print("📄 Analyzing index.html...")
        html_metrics = analyze_html_file(html_file)
        
        print(f"  ✅ File size: {html_metrics['file_size'] / 1024:.2f} KB")
        print(f"  ✅ Lines of code: {html_metrics['line_count']}")
        print(f"  ✅ External resources: {len(html_metrics['external_resources'])}")
        print(f"  ✅ Local scripts: {len([s for s in html_metrics['scripts'] if not s.startswith('http')])}")
        print(f"  ✅ Images referenced: {len(html_metrics['images'])}")
    else:
        print("❌ index.html not found")
        return
    
    # Analyze assets
    print("\n📁 Analyzing assets directory...")
    assets_info = analyze_assets_directory()
    print(f"  ✅ Total assets size: {assets_info['total_size'] / 1024:.2f} KB")
    print(f"  ✅ CSS files: {len(assets_info['file_types'].get('.css', []))}")
    print(f"  ✅ JS files: {len(assets_info['file_types'].get('.js', []))}")
    print(f"  ✅ Image files: {len(assets_info['file_types'].get('.jpg', []) + assets_info['file_types'].get('.jpeg', []) + assets_info['file_types'].get('.png', []))}")
    
    # Generate detailed report
    print("\n📊 Generating detailed report...")
    performance_report = generate_performance_report(html_metrics, assets_info)
    
    # Save detailed analysis to JSON
    with open('baseline-analysis.json', 'w') as f:
        json.dump({
            'html_metrics': html_metrics,
            'assets_info': assets_info,
            'performance_report': performance_report
        }, f, indent=2)
    
    print("  ✅ Detailed analysis saved to baseline-analysis.json")
    
    # Print accessibility summary
    print("\n♿ Accessibility Features Found:")
    acc = html_metrics['accessibility_features']
    print(f"  ✅ Alt text attributes: {acc['alt_text_count']}")
    print(f"  ✅ ARIA attributes: {acc['aria_labels']}")
    print(f"  ✅ Semantic elements: {acc['semantic_elements']}")
    print(f"  ✅ Form labels: {acc['form_labels']}")
    
    # Print external dependencies
    print("\n🌐 External Dependencies:")
    for resource in html_metrics['external_resources']:
        print(f"  📡 {resource}")
    
    # Print optimization opportunities
    if performance_report['optimization_opportunities']:
        print("\n⚡ Optimization Opportunities:")
        for opportunity in performance_report['optimization_opportunities']:
            print(f"  💡 {opportunity}")
    
    print("\n✅ Baseline analysis complete!")
    print("📄 See 'audit-baseline.md' for detailed report")
    print("📊 See 'baseline-analysis.json' for raw metrics")

if __name__ == "__main__":
    main()
