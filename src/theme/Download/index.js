import React from 'react';
import clsx from 'clsx';
import filesize from 'filesize';
import useSWR from 'swr';
import Link from '@docusaurus/Link';
import {FiGithub, FiPackage} from 'react-icons/fi';
import {DiApple, DiDebian, DiWindows} from 'react-icons/di';

import Headline from '@theme/Headline';
import styles from './styles.module.scss';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function useLatestRelease() {
  const {data, error} = useSWR(
    `https://api.github.com/repos/runletapp/runlet/releases/latest`,
    fetcher,
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

function icon(type) {
  const size = 24;

  switch (type) {
    case 'application/x-apple-diskimage':
      return <DiApple size={size} />;
    case 'application/x-msdos-program':
      return <DiWindows size={size} />;
    case 'application/x-debian-package':
      return <DiDebian size={size} />;
    default:
      return <FiPackage size={size} />;
  }
}

function Download() {
  const {data} = useLatestRelease();

  return (
    <section id="download">
      <div className="container">
        <Headline
          category="Download"
          title="ARM, Linux, MacOS, Windows, you name it!"
          offset={1}
        />

        <div className="row">
          <div className="col col--5 col--offset-1">
            <p>
              The desktop distribution includes both the daemon and GUI, and is
              recommended for Linux, Mac and Windows. The ARM distribution
              includes only the daemon, and is recommended for resource
              constrained devices like the Raspberry Pi.
            </p>

            <Link
              className={clsx(
                'button button--primary button--lg',
                styles.button,
              )}
              href="https://github.com/runletapp/runlet/releases">
              <FiGithub size={24} /> GitHub Releases
            </Link>
          </div>

          <div className="col col--6">
            {data && (
              <div className={styles.assets}>
                {data.assets.map((asset, idx) => (
                  <div className={styles.asset} key={idx}>
                    <div>
                      {icon(asset.content_type)}
                      <a href={asset.browser_download_url} download>
                        {asset.name}
                      </a>
                    </div>
                    <div className={styles.size}>{filesize(asset.size)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Download;