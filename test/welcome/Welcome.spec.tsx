import React from 'react';
import Welcome from '../../src/welcome/Welcome';
import renderer from 'react-test-renderer';

const LazyComp = React.lazy(() => import('../mock/LazyComp'));

jest.mock('@/skeleton/Skeleton',() => ({children, ...props}) => <div data-testid="ds-skeleton" {...props} data-circle={true} data-height={10} data-width={20}>{children}</div>)
jest.mock('@/safe/SafeView',() => ({children, ...props}) => <div data-testid="ds-safe" {...props}>{children}</div>)

describe('np test', function () {
  it('is testing a sample Welcome.', async () => {
    const tree = renderer
      .create(
        <>
          <Welcome />
        </>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});

