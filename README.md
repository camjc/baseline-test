Baseline Test
===============

Baseline Test checks page elements to see if they align to a vertical baseline grid.
It will then propose changes (in the console) to CSS to fix alignment,
and highlight any checked elements that don't conform to the desired baseline.

Pass selectors to check into the array in settings.
Set desired baseline in settings (in pixels).
You can also give it a container so that it only looks at part of a page.

You can call Baseline Test directly in the console using BaselineTest.check(" css selector ");