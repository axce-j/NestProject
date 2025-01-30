import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeService } from './challenge.service';
import { Challenge } from './challenge.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Users } from 'src/users/entities/users.entity';

describe('ChallengeService', () => {
  let service: ChallengeService;
  let challengeRepository;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeService,
        {
          provide: getRepositoryToken(Challenge),
          useValue: {
            create: jest.fn().mockReturnValue({}),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Users),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChallengeService>(ChallengeService);
    challengeRepository = module.get(getRepositoryToken(Challenge));
    userRepository = module.get(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateChallenge', () => {
    it('should generate a challenge token successfully', async () => {
      const user = { id: 1, role: 'STUDENT', biometricKey: 'fakeKey' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);

      const result = await service.generateChallenge({ user_id: 1 });

      expect(result).toBeDefined();
      expect(challengeRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.generateChallenge({ user_id: 999 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('verifyChallenge', () => {
    it('should verify the challenge successfully', async () => {
      const user = { id: 1, biometricKey: 'fakeKey' };
      const challenge = {
        challenge_token: 'token',
        user,
        expiration_time: new Date(Date.now() + 10000), // 10 seconds from now
      };
      jest
        .spyOn(challengeRepository, 'findOne')
        .mockResolvedValueOnce(challenge);
      jest.spyOn(challengeRepository, 'save').mockResolvedValueOnce(challenge);

      const result = await service.verifyChallenge({
        challenge_token: 'token',
        biometric_response: 'fakeKey',
      });

      expect(result).toBe(true);
    });

    it('should throw NotFoundException if challenge is not found', async () => {
      jest.spyOn(challengeRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.verifyChallenge({
          challenge_token: 'token',
          biometric_response: 'fakeKey',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if the challenge is expired', async () => {
      const user = { id: 1, biometricKey: 'fakeKey' };
      const challenge = {
        challenge_token: 'token',
        user,
        expiration_time: new Date(Date.now() - 10000), // expired: 10 seconds ago
      };
      jest
        .spyOn(challengeRepository, 'findOne')
        .mockResolvedValueOnce(challenge);

      await expect(
        service.verifyChallenge({
          challenge_token: 'token',
          biometric_response: 'fakeKey',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
