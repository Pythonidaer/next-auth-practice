import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Track Your Progress',
    // Svg: require('@site/static/img/progress_tracking.svg').default,
    description: (
      <>
        Monitor your personal workout stats with a powerful dashboard designed
        to help you stay motivated and visualize your progress over time.
      </>
    ),
  },
  {
    title: 'Build Custom Workout Plans',
    // Svg: require('@site/static/img/custom_plans.svg').default,
    description: (
      <>
        Create personalized workout plans that match your fitness goals. Whether
        you&#39;re training for strength, endurance, or flexibility, Meatbag
        adapts to you.
      </>
    ),
  },
  {
    title: 'Share and Discover Programs',
    // Svg: require('@site/static/img/program_sharing.svg').default,
    description: (
      <>
        Share your workout programs with friends or discover routines from other
        users. Learn, grow, and challenge each other in a connected fitness
        community.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      {/* <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div> */}
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
