import { renderWithAccountSelect as render } from '../helpers';
import IndexPage from '../../pages/index';

jest.mock('@theme-ui/match-media', () => {
  return {
    useBreakpointIndex: jest.fn(() => 3)
  };
});

let component;
beforeEach(async () => {
  component = render(<IndexPage />);
});

describe('renders index page', () => {
  test('renders header section', async () => {
    expect(await component.findByText('Liquidations 2.0')).toBeDefined();
  });
});
