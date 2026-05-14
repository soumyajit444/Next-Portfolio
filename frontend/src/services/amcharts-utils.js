import * as am4core from "@amcharts/amcharts4/core";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

/**
 * Transform your API skills array into amCharts ForceDirected format
 */
export function transformSkillsForAmCharts(skills, options = {}) {
  const { rootName = "Skills", minRating = 1, maxRating = 10 } = options;

  const blueVioletPalette = ["#6366f1", "#8b5cf6", "#7c3aed", "#4f46e5"];

  return {
    name: rootName,
    children: skills.map((skill, index) => ({
      name: skill.Name,
      value: Math.max(minRating, Math.min(maxRating, skill.Rating)),
      color: blueVioletPalette[index % blueVioletPalette.length],
      original: skill,
    })),
  };
}

/**
 * Create ForceDirected bubble chart - hover only, no click/drag interactions
 */
export function createPackedCircleChart(containerId, chartData, config = {}) {
  const {
    minRadius = 3,
    maxRadius = 20,
    manyBodyStrength = -12,
    linkDistance = 1,
    showLabels = true,
    enableInteractions = true,
  } = config;

  const chart = am4core.create(
    containerId,
    am4plugins_forceDirected.ForceDirectedTree,
  );

  // Disable zoom controls
  chart.zoomOutButton.disabled = true;
  chart.maxZoomLevel = 1;

  const series = chart.series.push(
    new am4plugins_forceDirected.ForceDirectedSeries(),
  );

  chart.data = [chartData];

  // Data fields
  series.dataFields.name = "name";
  series.dataFields.value = "value";
  series.dataFields.children = "children";
  series.dataFields.id = "name";
  series.dataFields.linkWith = "linkWith";

  // Physics
  series.velocityDecay = 0.18;
  series.centerStrength = 0.06;
  series.manyBodyStrength = manyBodyStrength;

  // Bubble sizing
  series.minRadius = am4core.percent(minRadius);
  series.maxRadius = am4core.percent(maxRadius);

  // Hide links
  series.links.template.strokeOpacity = 0;
  series.links.template.distance = linkDistance;

  // Nodes setup
  const nodeTemplate = series.nodes.template;
  nodeTemplate.tooltipText = "{name}: {value}/10";
  nodeTemplate.fillOpacity = 1;
  nodeTemplate.strokeOpacity = 0;

  nodeTemplate.draggable = true;
  nodeTemplate.interactionsEnabled = true; // Ensure interactions are enabled
  nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer; // Visual cue

  // Prevent outerCircle from intercepting events (if present)
  if (nodeTemplate.outerCircle) {
    nodeTemplate.outerCircle.disabled = true;
    nodeTemplate.outerCircle.interactionsEnabled = false;
  }

  // Ensure labels don't block node dragging
  if (showLabels) {
    nodeTemplate.label.text = "{name}";
    nodeTemplate.label.fill = am4core.color("#ffffff");
    nodeTemplate.label.fontSize = 10;
    nodeTemplate.label.hideOversized = true;
    nodeTemplate.label.truncate = true;
    nodeTemplate.label.disabled = false;

    nodeTemplate.label.interactionsEnabled = false;
  } else {
    nodeTemplate.label.disabled = true;
  }

  if (enableInteractions && config.onSkillClick) {
    nodeTemplate.events.on("hit", function (event) {
      if (!event.target.isDragging) {
        const skill = event.target.dataItem?.dataContext?.original;
        if (skill) config.onSkillClick(skill);
      }
    });
  }

  // Color adapter
  nodeTemplate.adapter.add("fill", (fill, target) => {
    const data = target.dataItem?.dataContext;

    // Root center bubble
    if (data?.name === "My Skills") {
      return am4core.color("#ab87ff");
    }

    // Child bubbles
    if (data?.color) {
      return am4core.color(data.color);
    }

    return fill;
  });

  // Floating animation
  series.animate(
    [{ property: "alpha", from: 0, to: 1 }],
    800,
    am4core.ease.quadOut,
  );

  chart.padding(0, 0, 0, 0);

  return chart;
}
/**
 * Safely dispose an amCharts instance
 */
export function disposeChart(chart) {
  if (chart && typeof chart.dispose === "function") {
    chart.dispose();
  }
}
