import "./SecurityFlow.css";
import {
  Radar,
  SearchCheck,
  Gauge,
  ShieldCheck,
  FileText,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Radar,
    title: "Detect",
    description: "Identify suspicious files, links, URLs, and activity.",
  },
  {
    number: "02",
    icon: SearchCheck,
    title: "Analyze",
    description: "Examine the detected activity using security intelligence.",
  },
  {
    number: "03",
    icon: Gauge,
    title: "Assess",
    description: "Calculate the risk level and determine the potential impact.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Protect",
    description: "Recommend or apply security actions to reduce the threat.",
  },
  {
    number: "05",
    icon: FileText,
    title: "Report",
    description: "Generate clear results and security reports for the user.",
  },
];

function SecurityFlow() {
  return (
    <section className="securityFlow">

      <div className="flowHeading">
        <span>HOW SENTINELX WORKS</span>

        <h2>
          From <strong>Detection</strong> to Protection
        </h2>

        <p>
          SentinelX combines multiple security capabilities into one
          intelligent protection workflow.
        </p>
      </div>

      <div className="flowContainer">

        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div className="flowStep" key={step.number}>

              <div className="stepNumber">
                {step.number}
              </div>

              <div className="stepIcon">
                <Icon size={27} />
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

              {index !== steps.length - 1 && (
                <div className="flowLine"></div>
              )}

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default SecurityFlow;