#!/usr/bin/env python3
"""
Basic Accessibility Checker
Performs basic accessibility analysis on the HTML file
"""

import re
from pathlib import Path

def check_accessibility_issues(html_content):
    """Check for common accessibility issues."""
    issues = []
    recommendations = []
    
    # Check for images without alt text
    img_pattern = r'<img[^>]*(?:(?!alt=).)*>'
    images_without_alt = re.findall(img_pattern, html_content)
    if images_without_alt:
        issues.append(f"Found {len(images_without_alt)} images without alt text")
    
    # Check for empty alt text (decorative images should have alt="")
    empty_alt = re.findall(r'alt=""', html_content)
    if empty_alt:
        recommendations.append(f"Found {len(empty_alt)} images with empty alt text - verify these are decorative")
    
    # Check for form inputs without labels
    input_pattern = r'<input[^>]*>'
    inputs = re.findall(input_pattern, html_content)
    label_pattern = r'<label[^>]*for=["\'](.*?)["\'][^>]*>'
    labels = re.findall(label_pattern, html_content)
    
    if len(inputs) > len(labels):
        issues.append(f"Potential form accessibility issue: {len(inputs)} inputs vs {len(labels)} labels")
    
    # Check for heading hierarchy
    headings = re.findall(r'<h([1-6])', html_content)
    if headings:
        heading_levels = [int(h) for h in headings]
        if heading_levels[0] != 1:
            issues.append("Page doesn't start with h1 - heading hierarchy issue")
        
        # Check for skipped heading levels
        for i in range(1, len(heading_levels)):
            if heading_levels[i] - heading_levels[i-1] > 1:
                issues.append("Skipped heading levels detected - hierarchy issue")
    
    # Check for missing lang attribute
    if 'lang=' not in html_content:
        issues.append("Missing lang attribute on html element")
    
    # Check for missing viewport meta tag
    if 'viewport' not in html_content:
        issues.append("Missing viewport meta tag")
    
    # Check for missing skip links
    if 'skip' not in html_content.lower():
        recommendations.append("Consider adding skip links for keyboard navigation")
    
    # Check for focus management
    if 'focus' not in html_content.lower():
        recommendations.append("Consider implementing proper focus management")
    
    # Check for color contrast considerations
    if 'contrast' not in html_content.lower() and 'color' in html_content.lower():
        recommendations.append("Ensure color contrast meets WCAG AA standards (4.5:1 for normal text)")
    
    return issues, recommendations

def analyze_keyboard_navigation(html_content):
    """Analyze keyboard navigation support."""
    nav_issues = []
    
    # Check for interactive elements
    interactive_elements = (
        len(re.findall(r'<button', html_content)) +
        len(re.findall(r'<a[^>]+href', html_content)) +
        len(re.findall(r'<input', html_content)) +
        len(re.findall(r'<select', html_content)) +
        len(re.findall(r'<textarea', html_content))
    )
    
    # Check for tabindex usage
    tabindex_count = len(re.findall(r'tabindex=', html_content))
    
    if tabindex_count == 0 and interactive_elements > 0:
        nav_issues.append("No explicit tabindex found - ensure natural tab order is logical")
    
    # Check for potentially problematic tabindex values
    negative_tabindex = len(re.findall(r'tabindex=["\']?-\d+["\']?', html_content))
    if negative_tabindex > 0:
        nav_issues.append(f"Found {negative_tabindex} negative tabindex values - use carefully")
    
    return nav_issues, interactive_elements

def main():
    """Main accessibility analysis function."""
    print("♿ Basic Accessibility Analysis")
    print("=" * 50)
    
    html_file = Path('./index.html')
    if not html_file.exists():
        print("❌ index.html not found")
        return
    
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Run accessibility checks
    issues, recommendations = check_accessibility_issues(html_content)
    nav_issues, interactive_count = analyze_keyboard_navigation(html_content)
    
    # Print results
    print("🔍 Accessibility Issues Found:")
    if issues:
        for issue in issues:
            print(f"  ❌ {issue}")
    else:
        print("  ✅ No major accessibility issues detected")
    
    print("\n💡 Recommendations:")
    if recommendations:
        for rec in recommendations:
            print(f"  💡 {rec}")
    else:
        print("  ✅ No specific recommendations")
    
    print("\n⌨️ Keyboard Navigation Analysis:")
    print(f"  ✅ Interactive elements found: {interactive_count}")
    if nav_issues:
        for issue in nav_issues:
            print(f"  ⚠️ {issue}")
    else:
        print("  ✅ No keyboard navigation issues detected")
    
    # Additional checks
    print("\n📊 Accessibility Metrics Summary:")
    alt_texts = len(re.findall(r'alt=["\'][^"\']*["\']', html_content))
    form_labels = len(re.findall(r'<label', html_content))
    semantic_elements = len(re.findall(r'<(header|nav|main|section|article|aside|footer|h[1-6])', html_content))
    
    print(f"  ✅ Alt text attributes: {alt_texts}")
    print(f"  ✅ Form labels: {form_labels}")
    print(f"  ✅ Semantic HTML elements: {semantic_elements}")
    
    # Generate accessibility score (simple heuristic)
    score = 100
    score -= len(issues) * 10
    score -= len(nav_issues) * 5
    score = max(0, score)  # Don't go below 0
    
    print(f"\n🎯 Estimated Accessibility Score: {score}/100")
    
    if score >= 90:
        print("  🟢 Excellent accessibility foundation!")
    elif score >= 70:
        print("  🟡 Good accessibility, with room for improvement")
    else:
        print("  🔴 Accessibility needs attention")
    
    print("\n✅ Basic accessibility analysis complete!")
    print("💡 For comprehensive testing, use tools like axe-core, WAVE, or Lighthouse")

if __name__ == "__main__":
    main()
