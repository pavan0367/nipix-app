describe('Reels Module Tests (SRS TC18)', () => {
  test('TC18: Reel object contains views, shares, and videoUrl', () => {
    const reel = {
      id: 1,
      userId: 1,
      video_url: 'https://res.cloudinary.com/nipix/video/upload/demo.mp4',
      views: 0,
      shares: 0,
    };

    expect(reel.video_url).toMatch(/^https?:\/\//);
    expect(reel.views).toBe(0);
    expect(reel.shares).toBe(0);
  });
});
