const covid19ImpactEstimator = (data) => {
  const output = {
    data,
    impact: {},
    severeImpact: {}
  };

  // challenge 1
  let days = null;
  let normalize = null;
  if (data.periodType === 'days') {
    normalize = 2 ** Math.trunc(data.timeToElapse / 3);
    days = data.timeToElapse;
  } else if (data.periodType === 'weeks') {
    normalize = 2 ** Math.trunc((data.timeToElapse * 7) / 3);
    days = data.timeToElapse * 7;
  } else {
    normalize = 2 ** Math.trunc((data.timeToElapse * 30) / 3);
    days = data.timeToElapse * 30;
  }
  const dollarFunc1 = () => {
    const answer = output.impact.infectionsByRequestedTime
      * data.region.avgDailyIncomePopulation
      * data.region.avgDailyIncomeInUSD;
    return answer;
  };
  const dollarFunc2 = () => {
    const answer = output.severeImpact.infectionsByRequestedTime
      * data.region.avgDailyIncomePopulation
      * data.region.avgDailyIncomeInUSD;
    return answer;
  };
  // impact object
  output.impact.currentlyInfected = Math.trunc(data.reportedCases * 10);
  output.impact.infectionsByRequestedTime = Math.trunc(
    output.impact.currentlyInfected * normalize
  );
  // severe object
  output.severeImpact.currentlyInfected = Math.trunc(data.reportedCases * 50);
  output.severeImpact.infectionsByRequestedTime = Math.trunc(
    output.severeImpact.currentlyInfected * normalize
  );
  // challenge 2
  // impact object
  output.impact.severeCasesByRequestedTime = Math.trunc(
    0.15 * output.impact.infectionsByRequestedTime
  );
  const impact = output.impact.infectionsByRequestedTime;
  output.impact.hospitalBedsByRequestedTime = Math.trunc(
    0.35 * data.totalHospitalBeds - output.impact.severeCasesByRequestedTime
  );

  const severe = output.severeImpact.infectionsByRequestedTime;
  output.severeImpact.severeCasesByRequestedTime = Math.trunc(0.15 * severe);
  output.severeImpact.hospitalBedsByRequestedTime = Math.trunc(
    0.35 * data.totalHospitalBeds
      - output.severeImpact.severeCasesByRequestedTime
  );
  output.impact.casesForICUByRequestedTime = Math.trunc(0.05 * impact);
  output.impact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * output.impact.infectionsByRequestedTime
  );
  output.impact.dollarsInFlight = dollarFunc1() / days;

  output.impact.dollarsInFlight = Math.trunc(output.impact.dollarsInFlight);

  output.severeImpact.casesForICUByRequestedTime = Math.trunc(0.05 * severe);
  output.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * output.severeImpact.infectionsByRequestedTime
  );

  output.severeImpact.dollarsInFlight = dollarFunc2() / days;
  output.severeImpact.dollarsInFlight = Math.trunc(
    output.severeImpact.dollarsInFlight
  );

  return output;
};

export default covid19ImpactEstimator;
