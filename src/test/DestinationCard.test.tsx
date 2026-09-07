import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TripProvider } from '../context/TripContext';
import { DestinationCard } from '../components/features/gallery/DestinationCard';
import { DESTINATIONS } from '../data/destinations';

describe('DestinationCard Component Suite', () => {
  const mockDest = DESTINATIONS[0];

  it('should render destination title and match score', () => {
    render(
      <TripProvider>
        <DestinationCard destination={{ ...mockDest, matchScore: 98 }} />
      </TripProvider>
    );

    expect(screen.getByText('Big Sur Highway Sanctuary')).toBeInTheDocument();
    expect(screen.getByText('98% Match')).toBeInTheDocument();
    expect(screen.getByText(/48h Plan/i)).toBeInTheDocument();
  });
});
